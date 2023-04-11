module Finance.Update exposing (..)

import AppScript.Spreadsheet
import AppScript.UrlFetch
import Array
import Codec
import Dict
import Finance.Config
import Finance.Utils
import FioCz
import Iso8601
import JavaScript
import Json.Decode
import Result.Extra
import Task
import Time
import Time.Codec
import Url


transactions : AppScript.Spreadsheet.Sheet -> List Finance.Config.Config -> Task.Task JavaScript.Error ()
transactions sheet configs =
    Task.sequence
        [ fetchAndInsertNewTransactions sheet (Finance.Config.fioTokens configs)
        , updateCells sheet (Finance.Config.rules configs)
        ]
        |> Task.map (\_ -> ())



--


fetchAndInsertNewTransactions : AppScript.Spreadsheet.Sheet -> List String -> Task.Task JavaScript.Error ()
fetchAndInsertNewTransactions sheet tokens =
    Time.now
        |> Task.andThen (\x -> Task.sequence (List.map (fetchNewTransactions x) tokens))
        |> Task.andThen (\x -> insertNewTransactions sheet (List.concat x))


fetchNewTransactions : Time.Posix -> String -> Task.Task JavaScript.Error (List FioCz.Transaction)
fetchNewTransactions time token =
    let
        url : String
        url =
            "https://www.fio.cz/ib_api/rest/periods/"
                ++ Url.percentEncode token
                ++ "/"
                ++ Url.percentEncode (String.left 10 (Iso8601.fromTime (minusDays 30 time)))
                ++ "/"
                ++ Url.percentEncode (String.left 10 (Iso8601.fromTime time))
                ++ "/transactions.json"
    in
    AppScript.UrlFetch.fetch url
        |> Task.andThen
            (\x ->
                case Json.Decode.decodeString FioCz.statementDecoder x of
                    Ok x2 ->
                        Task.succeed x2.transactions

                    Err x2 ->
                        Task.fail (JavaScript.DecodeError x2)
            )
        |> Task.onError
            (\_ ->
                AppScript.Spreadsheet.alert "Update Transactions Failed" "Cannot connect to Fio bank."
                    |> Task.map (\() -> [])
            )


insertNewTransactions : AppScript.Spreadsheet.Sheet -> List FioCz.Transaction -> Task.Task JavaScript.Error ()
insertNewTransactions sheet a =
    let
        rowToNonEmptyString : List AppScript.Spreadsheet.Value -> Maybe String
        rowToNonEmptyString b =
            case Finance.Utils.cellsToString b of
                "" ->
                    Nothing

                c ->
                    Just c

        transactionsInSheet : Task.Task JavaScript.Error (Result Json.Decode.Error (List FioCz.Transaction))
        transactionsInSheet =
            AppScript.Spreadsheet.getRange sheet "A2:A"
                |> Task.andThen AppScript.Spreadsheet.getValues
                |> Task.map
                    (\x ->
                        List.filterMap rowToNonEmptyString x
                            |> List.map (Codec.decodeString transactionCodec)
                            |> Result.Extra.sequence
                    )
    in
    transactionsInSheet
        |> Task.andThen
            (\x ->
                case x of
                    Ok b ->
                        let
                            newTransactions : List FioCz.Transaction
                            newTransactions =
                                computeNewTransaction a b

                            count : Int
                            count =
                                List.length newTransactions
                        in
                        if count == 0 then
                            Task.succeed ()

                        else
                            AppScript.Spreadsheet.insertRowsAfter sheet 1 count
                                |> Task.andThen (\() -> AppScript.Spreadsheet.getRange sheet ("A2:A" ++ String.fromInt (count + 1)))
                                |> Task.andThen
                                    (\x2 ->
                                        AppScript.Spreadsheet.setValues
                                            x2
                                            (List.map
                                                (\x3 ->
                                                    [ AppScript.Spreadsheet.Text (Codec.encodeToString 0 transactionCodec x3)
                                                    ]
                                                )
                                                newTransactions
                                            )
                                    )

                    Err _ ->
                        AppScript.Spreadsheet.alert "Update Transactions Failed" "Cannot decode transactions."
            )



--


updateCells : AppScript.Spreadsheet.Sheet -> List String -> Task.Task JavaScript.Error ()
updateCells sheet rules =
    AppScript.Spreadsheet.allRange sheet
        |> Task.andThen
            (\x ->
                AppScript.Spreadsheet.getValues_ x
                    |> Task.andThen
                        (\x2 ->
                            AppScript.Spreadsheet.setValues_ x (updateValues rules x2)
                        )
            )


updateValues : List String -> Array.Array (Array.Array AppScript.Spreadsheet.Value) -> Array.Array (Array.Array AppScript.Spreadsheet.Value)
updateValues _ a =
    a



--


computeNewTransaction : List FioCz.Transaction -> List FioCz.Transaction -> List FioCz.Transaction
computeNewTransaction a b =
    Dict.merge
        (\_ x acc -> x :: acc)
        (\_ _ _ acc -> acc)
        (\_ _ acc -> acc)
        (Dict.fromList (List.map (\x -> ( x.id, x )) a))
        (Dict.fromList (List.map (\x -> ( x.id, x )) b))
        []


minusDays : Int -> Time.Posix -> Time.Posix
minusDays days a =
    Time.millisToPosix (Time.posixToMillis a - days * 24 * 60 * 60 * 1000)


transactionCodec : Codec.Codec FioCz.Transaction
transactionCodec =
    Codec.versioned
        "FioCzTransaction1"
        (Codec.record (\x1 x2 x3 x4 x5 x6 x7 x8 x9 x10 x11 x12 x13 x14 x15 x16 x17 x18 x19 x20 -> { id = x1, type_ = x2, amount = x3, currency = x4, originalAmount = x5, date = x6, accountName = x7, accountNumber = x8, bankName = x9, bankNumber = x10, bankBic = x11, constantSymbol = x12, variableSymbol = x13, specificSymbol = x14, reference = x15, description = x16, message = x17, note = x18, author = x19, orderId = x20 })
            |> Codec.field .id Codec.int
            |> Codec.field .type_ Codec.string
            |> Codec.field .amount Codec.float
            |> Codec.field .currency Codec.string
            |> Codec.field .originalAmount
                (Codec.maybe
                    (Codec.record (\x1 x2 -> { amount = x1, currency = x2 })
                        |> Codec.field .amount Codec.float
                        |> Codec.field .currency Codec.string
                        |> Codec.buildRecord
                    )
                )
            |> Codec.field .date Time.Codec.posix
            |> Codec.field .accountName (Codec.maybe Codec.string)
            |> Codec.field .accountNumber (Codec.maybe Codec.string)
            |> Codec.field .bankName (Codec.maybe Codec.string)
            |> Codec.field .bankNumber (Codec.maybe Codec.string)
            |> Codec.field .bankBic (Codec.maybe Codec.string)
            |> Codec.field .constantSymbol (Codec.maybe Codec.string)
            |> Codec.field .variableSymbol (Codec.maybe Codec.string)
            |> Codec.field .specificSymbol (Codec.maybe Codec.string)
            |> Codec.field .reference (Codec.maybe Codec.string)
            |> Codec.field .description (Codec.maybe Codec.string)
            |> Codec.field .message (Codec.maybe Codec.string)
            |> Codec.field .note (Codec.maybe Codec.string)
            |> Codec.field .author (Codec.maybe Codec.string)
            |> Codec.field .orderId (Codec.maybe Codec.int)
            |> Codec.buildRecord
        )

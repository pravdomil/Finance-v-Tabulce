module Finance.Main.Update exposing (..)

import AppScript.Spreadsheet
import AppScript.UrlFetch
import Array
import Codec
import Dict
import Finance.Category
import Finance.Column
import Finance.Column.Utils
import Finance.Config
import Finance.FioToken
import Finance.UserData
import Finance.UserData.Utils
import Finance.Value.Utils
import FioCz
import Iso8601
import JavaScript
import Json.Decode
import List.Extra
import Result.Extra
import Task
import Time
import Time.Codec
import Url


transactions : AppScript.Spreadsheet.Sheet -> List Finance.Config.Config -> Task.Task JavaScript.Error ()
transactions sheet configs =
    Task.sequence
        [ fetchAndInsertNewTransactions sheet (Finance.Config.fioTokens configs)
        , updateTransactions sheet (Finance.Config.categoryRules configs)
        ]
        |> Task.map (\_ -> ())



--


fetchAndInsertNewTransactions : AppScript.Spreadsheet.Sheet -> List Finance.FioToken.FioToken -> Task.Task JavaScript.Error ()
fetchAndInsertNewTransactions sheet tokens =
    Time.now
        |> Task.andThen (\x -> Task.sequence (List.map (fetchNewTransactions x) tokens))
        |> Task.andThen (\x -> insertNewTransactions sheet (List.concat x))


fetchNewTransactions : Time.Posix -> Finance.FioToken.FioToken -> Task.Task JavaScript.Error (List FioCz.Transaction)
fetchNewTransactions time token =
    let
        url : String
        url =
            "https://www.fio.cz/ib_api/rest/periods/"
                ++ Url.percentEncode (Finance.FioToken.toString token)
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
            case Finance.Value.Utils.cellsToString b of
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


updateTransactions : AppScript.Spreadsheet.Sheet -> List Finance.Category.Rule -> Task.Task JavaScript.Error ()
updateTransactions sheet rules =
    AppScript.Spreadsheet.allRange sheet
        |> Task.andThen
            (\x ->
                AppScript.Spreadsheet.getValues_ x
                    |> Task.andThen
                        (\x2 ->
                            AppScript.Spreadsheet.setValues_ x (updateTransactionsHelper rules x2)
                        )
            )


updateTransactionsHelper : List Finance.Category.Rule -> Array.Array (Array.Array AppScript.Spreadsheet.Value) -> Array.Array (Array.Array AppScript.Spreadsheet.Value)
updateTransactionsHelper rules a =
    let
        columns : List ( Int, Finance.Column.Column )
        columns =
            columnIndexes a

        findColumn : Finance.Column.Column -> Maybe Int
        findColumn b =
            List.Extra.findMap
                (\( x, x2 ) ->
                    if x2 == b then
                        Just x

                    else
                        Nothing
                )
                columns

        categoryColumnIndex : Maybe Int
        categoryColumnIndex =
            findColumn Finance.Column.Category

        subcategoryColumnIndex : Maybe Int
        subcategoryColumnIndex =
            findColumn Finance.Column.Subcategory

        fulfillmentDateColumnIndex : Maybe Int
        fulfillmentDateColumnIndex =
            findColumn Finance.Column.FulfillmentDate

        updateTransaction : Array.Array AppScript.Spreadsheet.Value -> Array.Array AppScript.Spreadsheet.Value
        updateTransaction b =
            case Array.get 0 b |> Maybe.andThen (\x -> Finance.Value.Utils.valueToString x |> Codec.decodeString transactionCodec |> Result.toMaybe) of
                Just transaction ->
                    let
                        data : Finance.UserData.UserData
                        data =
                            Finance.UserData.UserData
                                (categoryColumnIndex |> Maybe.andThen (\x -> Array.get x b) |> Maybe.withDefault (AppScript.Spreadsheet.Text ""))
                                (subcategoryColumnIndex |> Maybe.andThen (\x -> Array.get x b) |> Maybe.withDefault (AppScript.Spreadsheet.Text ""))
                                (fulfillmentDateColumnIndex |> Maybe.andThen (\x -> Array.get x b) |> Maybe.withDefault (AppScript.Spreadsheet.Text ""))
                                |> (\x ->
                                        case x.category of
                                            AppScript.Spreadsheet.Text "" ->
                                                Finance.UserData.Utils.categorize rules transaction x

                                            _ ->
                                                x
                                   )
                                |> (\x ->
                                        case x.fulfillmentDate of
                                            AppScript.Spreadsheet.Text "" ->
                                                { x | fulfillmentDate = AppScript.Spreadsheet.Date transaction.date }

                                            _ ->
                                                x
                                   )
                    in
                    List.foldl
                        (\( i, x ) acc ->
                            Array.set i (Finance.Column.Utils.transactionValue x data transaction) acc
                        )
                        b
                        columns

                Nothing ->
                    b
    in
    Array.indexedMap
        (\i x ->
            if i == 0 then
                x

            else
                updateTransaction x
        )
        a



--


columnIndexes : Array.Array (Array.Array AppScript.Spreadsheet.Value) -> List ( Int, Finance.Column.Column )
columnIndexes a =
    Array.get 0 a
        |> Maybe.map
            (\x ->
                Array.foldl
                    (\x2 ( acc, i ) ->
                        ( case Finance.Column.fromString (Finance.Value.Utils.valueToString x2) of
                            Just x3 ->
                                ( i, x3 ) :: acc

                            Nothing ->
                                acc
                        , i + 1
                        )
                    )
                    ( []
                    , 0
                    )
                    x
                    |> Tuple.first
                    |> List.reverse
            )
        |> Maybe.withDefault []


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

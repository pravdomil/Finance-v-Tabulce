module Finance.Main.Update exposing (..)

import AppScript.Fetch
import AppScript.Spreadsheet
import Array
import Codec
import Dict
import Finance.Account
import Finance.AccountName
import Finance.Category
import Finance.Column
import Finance.Column.Utils
import Finance.Config
import Finance.Transaction
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
import Url


transactions : AppScript.Spreadsheet.Sheet -> List Finance.Config.Config -> Task.Task JavaScript.Error ()
transactions sheet configs =
    Task.sequence
        [ fetchAndInsertNewTransactions sheet (Finance.Config.accounts configs)
        , updateTransactions sheet configs
        ]
        |> Task.map (\_ -> ())



--


fetchAndInsertNewTransactions : AppScript.Spreadsheet.Sheet -> List Finance.Account.Account -> Task.Task JavaScript.Error ()
fetchAndInsertNewTransactions sheet accounts =
    Time.now
        |> Task.andThen (\x -> Task.sequence (List.map (fetchNewTransactions x) accounts))
        |> Task.andThen (\x -> insertNewTransactions sheet (List.concat x))


fetchNewTransactions : Time.Posix -> Finance.Account.Account -> Task.Task JavaScript.Error (List Finance.Transaction.Transaction)
fetchNewTransactions time account =
    let
        url : String
        url =
            "https://www.fio.cz/ib_api/rest/periods/"
                ++ Url.percentEncode (Finance.Account.token account)
                ++ "/"
                ++ Url.percentEncode (String.left 10 (Iso8601.fromTime (minusDays 30 time)))
                ++ "/"
                ++ Url.percentEncode (String.left 10 (Iso8601.fromTime time))
                ++ "/transactions.json"
    in
    AppScript.Fetch.text url
        |> Task.andThen
            (\x ->
                case Json.Decode.decodeString FioCz.statementDecoder x of
                    Ok x2 ->
                        let
                            account_ : Finance.Transaction.Account
                            account_ =
                                Finance.Transaction.Account
                                    (Finance.Account.name account)
                                    x2.account.number
                                    x2.account.bankNumber
                                    x2.account.currency
                        in
                        Task.succeed
                            (List.map
                                (\x3 ->
                                    Finance.Transaction.Transaction account_ x3
                                )
                                x2.transactions
                            )

                    Err x2 ->
                        Task.fail (JavaScript.DecodeError x2)
            )
        |> Task.onError
            (\_ ->
                AppScript.Spreadsheet.alert "Update Transactions Failed" "Cannot connect to Fio bank."
                    |> Task.map (\() -> [])
            )


insertNewTransactions : AppScript.Spreadsheet.Sheet -> List Finance.Transaction.Transaction -> Task.Task JavaScript.Error ()
insertNewTransactions sheet a =
    let
        rowToNonEmptyString : List AppScript.Spreadsheet.Value -> Maybe String
        rowToNonEmptyString b =
            case Finance.Value.Utils.cellsToString b of
                "" ->
                    Nothing

                c ->
                    Just c

        transactionsInSheet : Task.Task JavaScript.Error (Result Json.Decode.Error (List Finance.Transaction.Transaction))
        transactionsInSheet =
            AppScript.Spreadsheet.getRange sheet "A2:A"
                |> Task.andThen AppScript.Spreadsheet.getValues
                |> Task.map
                    (\x ->
                        List.filterMap rowToNonEmptyString x
                            |> List.map (Codec.decodeString Finance.Transaction.codec)
                            |> Result.Extra.sequence
                    )
    in
    transactionsInSheet
        |> Task.andThen
            (\x ->
                case x of
                    Ok b ->
                        let
                            newTransactions : List Finance.Transaction.Transaction
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
                                                    [ AppScript.Spreadsheet.Text (Codec.encodeToString Finance.Transaction.codec x3)
                                                    ]
                                                )
                                                newTransactions
                                            )
                                    )

                    Err _ ->
                        AppScript.Spreadsheet.alert "Update Transactions Failed" "Cannot decode transactions."
            )



--


updateTransactions : AppScript.Spreadsheet.Sheet -> List Finance.Config.Config -> Task.Task JavaScript.Error ()
updateTransactions sheet configs =
    AppScript.Spreadsheet.allRange sheet
        |> Task.andThen
            (\x ->
                AppScript.Spreadsheet.getValues_ x
                    |> Task.andThen
                        (\x2 ->
                            AppScript.Spreadsheet.setValues_ x (updateTransactionsHelper configs x2)
                        )
            )


updateTransactionsHelper : List Finance.Config.Config -> Array.Array (Array.Array AppScript.Spreadsheet.Value) -> Array.Array (Array.Array AppScript.Spreadsheet.Value)
updateTransactionsHelper configs a =
    let
        rules : List Finance.Category.Rule
        rules =
            Finance.Config.categoryRules configs

        accountNames : Finance.AccountName.Database
        accountNames =
            Finance.AccountName.accountNamesToDatabase (Finance.Config.accountNames configs)

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

        userNoteColumnIndex : Maybe Int
        userNoteColumnIndex =
            findColumn Finance.Column.UserNote

        updateTransaction : Array.Array AppScript.Spreadsheet.Value -> Array.Array AppScript.Spreadsheet.Value
        updateTransaction b =
            case Array.get 0 b |> Maybe.andThen (\x -> Finance.Value.Utils.valueToString x |> Codec.decodeString Finance.Transaction.codec |> Result.toMaybe) of
                Just transaction ->
                    let
                        data : Finance.UserData.UserData
                        data =
                            Finance.UserData.UserData
                                (categoryColumnIndex |> Maybe.andThen (\x -> Array.get x b) |> Maybe.withDefault (AppScript.Spreadsheet.Text ""))
                                (subcategoryColumnIndex |> Maybe.andThen (\x -> Array.get x b) |> Maybe.withDefault (AppScript.Spreadsheet.Text ""))
                                (fulfillmentDateColumnIndex |> Maybe.andThen (\x -> Array.get x b) |> Maybe.withDefault (AppScript.Spreadsheet.Text ""))
                                (userNoteColumnIndex |> Maybe.andThen (\x -> Array.get x b) |> Maybe.withDefault (AppScript.Spreadsheet.Text ""))
                                |> (\x ->
                                        case x.category of
                                            AppScript.Spreadsheet.Text "" ->
                                                Finance.UserData.Utils.categorize accountNames rules transaction x

                                            _ ->
                                                x
                                   )
                                |> (\x ->
                                        case x.fulfillmentDate of
                                            AppScript.Spreadsheet.Text "" ->
                                                { x | fulfillmentDate = AppScript.Spreadsheet.Date transaction.transaction.date }

                                            _ ->
                                                x
                                   )
                                |> (\x ->
                                        case x.note of
                                            AppScript.Spreadsheet.Text "" ->
                                                { x | note = AppScript.Spreadsheet.Text (Maybe.withDefault "" transaction.transaction.note) }

                                            _ ->
                                                x
                                   )
                    in
                    List.foldl
                        (\( i, x ) acc ->
                            Array.set i (Finance.Column.Utils.transactionValue accountNames x data transaction) acc
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


computeNewTransaction : List Finance.Transaction.Transaction -> List Finance.Transaction.Transaction -> List Finance.Transaction.Transaction
computeNewTransaction a b =
    Dict.merge
        (\_ x acc -> x :: acc)
        (\_ _ _ acc -> acc)
        (\_ _ acc -> acc)
        (Dict.fromList (List.map (\x -> ( x.transaction.id, x )) a))
        (Dict.fromList (List.map (\x -> ( x.transaction.id, x )) b))
        []


minusDays : Int -> Time.Posix -> Time.Posix
minusDays days a =
    Time.millisToPosix (Time.posixToMillis a - days * 24 * 60 * 60 * 1000)

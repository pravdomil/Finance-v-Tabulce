module Finance.Update exposing (..)

import AppScript.Spreadsheet
import AppScript.UrlFetch
import Finance.Config
import FioCz
import Iso8601
import JavaScript
import Json.Decode
import Task
import Time
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
        |> Task.andThen (\x -> Task.sequence (List.map (fetchNewTransactions sheet x) tokens))
        |> Task.andThen (\x -> insertNewTransactions sheet (List.concat x))


fetchNewTransactions : AppScript.Spreadsheet.Sheet -> Time.Posix -> String -> Task.Task JavaScript.Error (List FioCz.Transaction)
fetchNewTransactions _ time token =
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
                AppScript.Spreadsheet.alert "Update Transactions Failed" "Sorry for that."
                    |> Task.map (\() -> [])
            )


insertNewTransactions : AppScript.Spreadsheet.Sheet -> List FioCz.Transaction -> Task.Task JavaScript.Error ()
insertNewTransactions _ _ =
    Task.succeed ()



--


updateCells : AppScript.Spreadsheet.Sheet -> List String -> Task.Task JavaScript.Error ()
updateCells _ _ =
    Task.succeed ()



--


minusDays : Int -> Time.Posix -> Time.Posix
minusDays days a =
    Time.millisToPosix (Time.posixToMillis a - days * 24 * 60 * 60 * 1000)

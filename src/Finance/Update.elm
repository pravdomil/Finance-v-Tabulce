module Finance.Update exposing (..)

import AppScript.Spreadsheet
import Finance.Config
import JavaScript
import Task


transactions : AppScript.Spreadsheet.Sheet -> List Finance.Config.Config -> Task.Task JavaScript.Error ()
transactions sheet configs =
    Task.sequence
        [ insertNewTransactions sheet (Finance.Config.fioTokens configs)
        , updateCells sheet (Finance.Config.rules configs)
        ]
        |> Task.map (\_ -> ())



--


insertNewTransactions : AppScript.Spreadsheet.Sheet -> List String -> Task.Task JavaScript.Error ()
insertNewTransactions sheet tokens =
    Task.sequence (List.map (insertNewTransactionsHelper sheet) tokens)
        |> Task.map (\_ -> ())


insertNewTransactionsHelper : AppScript.Spreadsheet.Sheet -> String -> Task.Task JavaScript.Error ()
insertNewTransactionsHelper _ _ =
    Task.succeed ()



--


updateCells : AppScript.Spreadsheet.Sheet -> List String -> Task.Task JavaScript.Error ()
updateCells _ _ =
    Task.succeed ()

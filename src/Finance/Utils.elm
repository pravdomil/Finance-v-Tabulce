module Finance.Utils exposing (..)

import AppScript.Spreadsheet
import Time


rowsToString : List (List AppScript.Spreadsheet.Value) -> String
rowsToString a =
    String.join "\n" (List.map cellsToString a)


cellsToString : List AppScript.Spreadsheet.Value -> String
cellsToString b =
    String.join "\t" (List.map valueToString b)


valueToString : AppScript.Spreadsheet.Value -> String
valueToString b =
    case b of
        AppScript.Spreadsheet.Text c ->
            c

        AppScript.Spreadsheet.WholeNumber c ->
            String.fromInt c

        AppScript.Spreadsheet.Number c ->
            String.fromFloat c

        AppScript.Spreadsheet.Date c ->
            String.fromInt (Time.posixToMillis c)

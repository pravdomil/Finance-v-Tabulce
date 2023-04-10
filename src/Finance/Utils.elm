module Finance.Utils exposing (..)

import AppScript.Spreadsheet
import Time


valuesToString : List (List AppScript.Spreadsheet.Value) -> String
valuesToString a =
    let
        valueToString : AppScript.Spreadsheet.Value -> String
        valueToString b =
            case b of
                AppScript.Spreadsheet.Text c ->
                    c

                AppScript.Spreadsheet.Number c ->
                    String.fromFloat c

                AppScript.Spreadsheet.Date c ->
                    String.fromInt (Time.posixToMillis c)

        valuesToString_ : List AppScript.Spreadsheet.Value -> String
        valuesToString_ b =
            String.join "\t" (List.map valueToString b)
    in
    String.join "\n" (List.map valuesToString_ a)

module AppScript.Script exposing (..)

import AppScript.Spreadsheet
import JavaScript
import Json.Decode
import Task


type Trigger
    = Trigger Json.Decode.Value


spreadsheetTriggers : AppScript.Spreadsheet.Spreadsheet -> Task.Task JavaScript.Error (List Trigger)
spreadsheetTriggers (AppScript.Spreadsheet.Spreadsheet a) =
    JavaScript.run
        "ScriptApp.getUserTriggers(a)"
        a
        (Json.Decode.list (Json.Decode.map Trigger Json.Decode.value))

module AppScript.Spreadsheet exposing (..)

import JavaScript
import Json.Decode
import Json.Encode
import Task


alert : String -> String -> Task.Task JavaScript.Error ()
alert title description =
    JavaScript.run "SpreadsheetApp.getUi().alert(a[0], a[1])"
        (Json.Encode.list Json.Encode.string [ title, description ])
        (Json.Decode.succeed ())

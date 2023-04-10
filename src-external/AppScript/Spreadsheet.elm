module AppScript.Spreadsheet exposing (..)

import JavaScript
import Json.Decode
import Json.Encode
import Task


type Spreadsheet
    = Spreadsheet Json.Decode.Value


active : Task.Task JavaScript.Error Spreadsheet
active =
    JavaScript.run
        "SpreadsheetApp.getActiveSpreadsheet()"
        Json.Encode.null
        (Json.Decode.map Spreadsheet Json.Decode.value)


name : Spreadsheet -> Task.Task JavaScript.Error String
name (Spreadsheet a) =
    JavaScript.run
        "a.getName()"
        a
        Json.Decode.string



--


type alias Event =
    { authMode : Json.Decode.Value
    , source : Spreadsheet
    , triggerUid : Json.Decode.Value
    , user : Json.Decode.Value
    }


eventDecoder : Json.Decode.Decoder Event
eventDecoder =
    Json.Decode.map4
        Event
        (Json.Decode.field "authMode" Json.Decode.value)
        (Json.Decode.field "source" (Json.Decode.map Spreadsheet Json.Decode.value))
        (Json.Decode.field "triggerUid" Json.Decode.value)
        (Json.Decode.field "user" Json.Decode.value)



--


alert : String -> String -> Task.Task JavaScript.Error ()
alert title description =
    JavaScript.run "SpreadsheetApp.getUi().alert(a[0], a[1], SpreadsheetApp.getUi().ButtonSet.OK)"
        (Json.Encode.list Json.Encode.string [ title, description ])
        (Json.Decode.succeed ())

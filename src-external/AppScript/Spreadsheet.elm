module AppScript.Spreadsheet exposing (..)

import JavaScript
import Json.Decode
import Json.Encode
import Task


type Spreadsheet
    = Spreadsheet Json.Decode.Value


active : Task.Task JavaScript.Error (Maybe Spreadsheet)
active =
    JavaScript.run
        "SpreadsheetApp.getActiveSpreadsheet()"
        Json.Encode.null
        (Json.Decode.oneOf
            [ Json.Decode.null Nothing
            , Json.Decode.map (Spreadsheet >> Just) Json.Decode.value
            ]
        )


name : Spreadsheet -> Task.Task JavaScript.Error String
name (Spreadsheet a) =
    JavaScript.run
        "a.getName()"
        a
        Json.Decode.string


showMessage : Spreadsheet -> String -> String -> Task.Task JavaScript.Error ()
showMessage (Spreadsheet a) title description =
    JavaScript.run "a[0].toast(a[1], a[2])"
        (Json.Encode.list identity [ a, Json.Encode.string description, Json.Encode.string title ])
        (Json.Decode.succeed ())


insertSheet : Spreadsheet -> String -> Task.Task JavaScript.Error Sheet
insertSheet (Spreadsheet a) name_ =
    JavaScript.run
        "a[0].insertSheet(a[1])"
        (Json.Encode.list identity [ a, Json.Encode.string name_ ])
        (Json.Decode.map Sheet Json.Decode.value)



--


type Sheet
    = Sheet Json.Decode.Value


sheetByName : Spreadsheet -> String -> Task.Task JavaScript.Error (Maybe Sheet)
sheetByName (Spreadsheet a) name_ =
    JavaScript.run "a[0].getSheetByName(a[1])"
        (Json.Encode.list identity [ a, Json.Encode.string name_ ])
        (Json.Decode.oneOf
            [ Json.Decode.null Nothing
            , Json.Decode.map (Sheet >> Just) Json.Decode.value
            ]
        )



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

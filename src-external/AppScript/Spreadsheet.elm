module AppScript.Spreadsheet exposing (..)

import Array
import JavaScript
import JavaScript.Decoder
import JavaScript.Encoder
import Json.Decode
import Json.Encode
import Task
import Time


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


insertRowsAfter : Sheet -> Int -> Int -> Task.Task JavaScript.Error ()
insertRowsAfter (Sheet a) rowNumber count =
    JavaScript.run
        "a[0].insertRowsAfter(a[1], a[2])"
        (Json.Encode.list identity [ a, Json.Encode.int rowNumber, Json.Encode.int count ])
        (Json.Decode.succeed ())


insertRowsBefore : Sheet -> Int -> Int -> Task.Task JavaScript.Error ()
insertRowsBefore (Sheet a) rowNumber count =
    JavaScript.run
        "a[0].insertRowsBefore(a[1], a[2])"
        (Json.Encode.list identity [ a, Json.Encode.int rowNumber, Json.Encode.int count ])
        (Json.Decode.succeed ())



--


type Range
    = Range Json.Decode.Value


allRange : Sheet -> Task.Task JavaScript.Error Range
allRange (Sheet a) =
    JavaScript.run
        "a.getRange(1, 1, a.getMaxRows(), a.getMaxColumns())"
        a
        (Json.Decode.map Range Json.Decode.value)


getRange : Sheet -> String -> Task.Task JavaScript.Error Range
getRange (Sheet a) range =
    JavaScript.run
        "a[0].getRange(a[1])"
        (Json.Encode.list identity [ a, Json.Encode.string range ])
        (Json.Decode.map Range Json.Decode.value)


getValue : Range -> Task.Task JavaScript.Error Value
getValue (Range a) =
    JavaScript.run
        "a.getValue()"
        a
        valueDecoder


setValue : Range -> Value -> Task.Task JavaScript.Error ()
setValue (Range a) value =
    JavaScript.run
        "a[0].setValue(a[1])"
        (Json.Encode.list identity [ a, encodeValue value ])
        (Json.Decode.succeed ())


getValues : Range -> Task.Task JavaScript.Error (List (List Value))
getValues (Range a) =
    JavaScript.run
        "a.getValues()"
        a
        (Json.Decode.list (Json.Decode.list valueDecoder))


getValues_ : Range -> Task.Task JavaScript.Error (Array.Array (Array.Array Value))
getValues_ (Range a) =
    JavaScript.run
        "a.getValues()"
        a
        (Json.Decode.array (Json.Decode.array valueDecoder))


setValues : Range -> List (List Value) -> Task.Task JavaScript.Error ()
setValues (Range a) values =
    JavaScript.run
        "a[0].setValues(a[1])"
        (Json.Encode.list identity [ a, Json.Encode.list (Json.Encode.list encodeValue) values ])
        (Json.Decode.succeed ())


setValues_ : Range -> Array.Array (Array.Array Value) -> Task.Task JavaScript.Error ()
setValues_ (Range a) values =
    JavaScript.run
        "a[0].setValues(a[1])"
        (Json.Encode.list identity [ a, Json.Encode.array (Json.Encode.array encodeValue) values ])
        (Json.Decode.succeed ())



--


type Value
    = Text String
    | Number Float
    | Date Time.Posix


valueDecoder : Json.Decode.Decoder Value
valueDecoder =
    Json.Decode.oneOf
        [ Json.Decode.map Text Json.Decode.string
        , Json.Decode.map Number Json.Decode.float
        , Json.Decode.map Date JavaScript.Decoder.timePosix
        ]


encodeValue : Value -> Json.Encode.Value
encodeValue a =
    case a of
        Text b ->
            Json.Encode.string b

        Number b ->
            Json.Encode.float b

        Date b ->
            JavaScript.Encoder.timePosix b



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

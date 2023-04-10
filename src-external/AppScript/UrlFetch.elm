module AppScript.UrlFetch exposing (..)

import JavaScript
import Json.Decode
import Json.Encode
import Task


fetch : String -> Task.Task JavaScript.Error String
fetch a =
    JavaScript.run
        "UrlFetchApp.fetch(a).getContentText()"
        (Json.Encode.string a)
        Json.Decode.string

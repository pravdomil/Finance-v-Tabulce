module Finance.Main exposing (..)

import AppScript.Spreadsheet
import Codec
import Finance.Action
import JavaScript
import Json.Decode
import Task


main : Program Json.Decode.Value () ()
main =
    Platform.worker
        { init = init
        , update = \_ a -> ( a, Cmd.none )
        , subscriptions = \_ -> Sub.none
        }



--


init : Json.Decode.Value -> ( (), Cmd () )
init flags =
    ( ()
    , mainTask flags |> Task.attempt (\_ -> ())
    )


mainTask : Json.Decode.Value -> Task.Task () ()
mainTask flags =
    let
        action : Result Json.Decode.Error Finance.Action.Action
        action =
            Json.Decode.decodeValue
                (Json.Decode.field "action" (Codec.decoder Finance.Action.codec))
                flags

        task : Task.Task JavaScript.Error ()
        task =
            case action of
                Ok b ->
                    case b of
                        Finance.Action.Install c ->
                            install c

                        Finance.Action.Open c ->
                            open c

                        Finance.Action.Update c ->
                            update c

                Err b ->
                    Task.fail (JavaScript.DecodeError b)
    in
    task
        |> Task.onError
            (\_ ->
                AppScript.Spreadsheet.alert "Application is Broken" "Sorry for that."
                    |> Task.onError (\_ -> Task.succeed ())
            )



--


install : AppScript.Spreadsheet.Event -> Task.Task JavaScript.Error ()
install _ =
    Task.succeed ()



--


open : AppScript.Spreadsheet.Event -> Task.Task JavaScript.Error ()
open _ =
    Task.succeed ()



--


update : AppScript.Spreadsheet.Event -> Task.Task JavaScript.Error ()
update _ =
    Task.succeed ()

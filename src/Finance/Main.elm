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
                (Json.Decode.field "action" (Codec.decoder Finance.Action.actionCodec))
                flags

        task : Task.Task JavaScript.Error ()
        task =
            case action of
                Ok b ->
                    case b of
                        Finance.Action.Install _ ->
                            install

                        Finance.Action.Open _ ->
                            open

                        Finance.Action.Update _ ->
                            update

                Err b ->
                    Task.fail (JavaScript.DecodeError b)
    in
    task
        |> Task.onError
            (\_ ->
                AppScript.Spreadsheet.alert "Application is Broken" "Sorry that that."
                    |> Task.onError (\_ -> Task.succeed ())
            )



--


install : Task.Task JavaScript.Error ()
install =
    Task.succeed ()



--


open : Task.Task JavaScript.Error ()
open =
    Task.succeed ()



--


update : Task.Task JavaScript.Error ()
update =
    Task.succeed ()

module Finance.Main exposing (..)

import AppScript.Script
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
                        Finance.Action.Install ->
                            install

                        Finance.Action.Open ->
                            open

                        Finance.Action.Update ->
                            update

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


install : Task.Task JavaScript.Error ()
install =
    AppScript.Spreadsheet.active
        |> Task.andThen
            (\x ->
                case x of
                    Just b ->
                        maybeInstallTriggers b

                    Nothing ->
                        Task.succeed ()
            )


maybeInstallTriggers : AppScript.Spreadsheet.Spreadsheet -> Task.Task JavaScript.Error ()
maybeInstallTriggers a =
    AppScript.Script.spreadsheetTriggers a
        |> Task.andThen
            (\x ->
                case x of
                    [] ->
                        installTriggers a

                    _ ->
                        Task.succeed ()
            )


installTriggers : AppScript.Spreadsheet.Spreadsheet -> Task.Task JavaScript.Error ()
installTriggers (AppScript.Spreadsheet.Spreadsheet a) =
    let
        onOpenTrigger : Task.Task JavaScript.Error ()
        onOpenTrigger =
            JavaScript.run
                "ScriptApp.newTrigger('onOpenTrigger').forSpreadsheet(a).onOpen().create()"
                a
                (Json.Decode.succeed ())

        onDailyTrigger : Task.Task JavaScript.Error ()
        onDailyTrigger =
            JavaScript.run
                "ScriptApp.newTrigger('onDailyTrigger').timeBased().atHour(6).everyDays(1).create()"
                a
                (Json.Decode.succeed ())
    in
    Task.sequence [ onOpenTrigger, onDailyTrigger ] |> Task.map (\_ -> ())



--


open : Task.Task JavaScript.Error ()
open =
    Task.succeed ()



--


update : Task.Task JavaScript.Error ()
update =
    Task.succeed ()

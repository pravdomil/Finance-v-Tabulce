module Finance.Main exposing (..)

import AppScript.Script
import AppScript.Spreadsheet
import Codec
import Finance.Action
import JavaScript
import Json.Decode
import Json.Encode
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
                    AppScript.Spreadsheet.active
                        |> Task.andThen
                            (\x ->
                                case x of
                                    Just x2 ->
                                        case b of
                                            Finance.Action.Install ->
                                                installAction x2

                                            Finance.Action.Update ->
                                                updateAction x2

                                            Finance.Action.OpenTrigger ->
                                                openTrigger x2

                                            Finance.Action.DailyTrigger ->
                                                dailyTrigger x2

                                    Nothing ->
                                        Task.succeed ()
                            )

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


installAction : AppScript.Spreadsheet.Spreadsheet -> Task.Task JavaScript.Error ()
installAction a =
    Task.sequence [ maybeInstallTriggers a, openTrigger a ] |> Task.map (\_ -> ())


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


updateAction : AppScript.Spreadsheet.Spreadsheet -> Task.Task JavaScript.Error ()
updateAction _ =
    Task.succeed ()



--


openTrigger : AppScript.Spreadsheet.Spreadsheet -> Task.Task JavaScript.Error ()
openTrigger _ =
    let
        createMenu : Task.Task JavaScript.Error ()
        createMenu =
            JavaScript.run
                "SpreadsheetApp.getUi().createMenu('Finance v Tabulce').addItem('Update', 'onUpdateAction').addToUi()"
                Json.Encode.null
                (Json.Decode.succeed ())
    in
    createMenu



--


dailyTrigger : AppScript.Spreadsheet.Spreadsheet -> Task.Task JavaScript.Error ()
dailyTrigger a =
    updateAction a

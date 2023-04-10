module Finance.Main exposing (..)

import AppScript.Script
import AppScript.Spreadsheet
import Codec
import Finance.Action
import Finance.Config
import Finance.Update
import Finance.Utils
import JavaScript
import Json.Decode
import Json.Encode
import Parser
import Parser.DeadEnd
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
    Task.sequence
        [ maybeInstallTriggers a
        , openTrigger a
        , updateAction a
        ]
        |> Task.map (\_ -> ())


maybeInstallTriggers : AppScript.Spreadsheet.Spreadsheet -> Task.Task JavaScript.Error ()
maybeInstallTriggers a =
    let
        installTriggers : Task.Task JavaScript.Error ()
        installTriggers =
            let
                onOpenTrigger : Task.Task JavaScript.Error ()
                onOpenTrigger =
                    JavaScript.run
                        "ScriptApp.newTrigger('onOpenTrigger').forSpreadsheet(a).onOpen().create()"
                        ((\(AppScript.Spreadsheet.Spreadsheet x) -> x) a)
                        (Json.Decode.succeed ())

                onDailyTrigger : Task.Task JavaScript.Error ()
                onDailyTrigger =
                    JavaScript.run
                        "ScriptApp.newTrigger('onDailyTrigger').timeBased().atHour(6).everyDays(1).create()"
                        ((\(AppScript.Spreadsheet.Spreadsheet x) -> x) a)
                        (Json.Decode.succeed ())
            in
            Task.sequence [ onOpenTrigger, onDailyTrigger ] |> Task.map (\_ -> ())
    in
    AppScript.Script.spreadsheetTriggers a
        |> Task.andThen
            (\x ->
                case x of
                    [] ->
                        installTriggers

                    _ ->
                        Task.succeed ()
            )



--


updateAction : AppScript.Spreadsheet.Spreadsheet -> Task.Task JavaScript.Error ()
updateAction a =
    maybeCreateTransactionsSheet a
        |> Task.andThen
            (\x ->
                maybeCreateConfigSheet a
                    |> Task.map (\x2 -> ( x, x2 ))
            )
        |> Task.andThen
            (\( transactions, config ) ->
                AppScript.Spreadsheet.getRange config "A:A"
                    |> Task.andThen AppScript.Spreadsheet.getValues
                    |> Task.andThen
                        (\x ->
                            case Parser.run Finance.Config.multipleParser (Finance.Utils.rowsToString x) of
                                Ok x2 ->
                                    Finance.Update.transactions transactions x2

                                Err x2 ->
                                    AppScript.Spreadsheet.alert "Invalid Config" (Parser.DeadEnd.listToString x2)
                        )
            )


maybeCreateTransactionsSheet : AppScript.Spreadsheet.Spreadsheet -> Task.Task JavaScript.Error AppScript.Spreadsheet.Sheet
maybeCreateTransactionsSheet a =
    let
        createTransactionsSheet : Task.Task JavaScript.Error AppScript.Spreadsheet.Sheet
        createTransactionsSheet =
            AppScript.Spreadsheet.insertSheet a "Transactions"
                |> Task.andThen
                    (\x ->
                        AppScript.Spreadsheet.getRange x "A1"
                            |> Task.andThen (\x2 -> AppScript.Spreadsheet.setValue x2 (AppScript.Spreadsheet.Text "Data"))
                            |> Task.map (\_ -> x)
                    )
    in
    AppScript.Spreadsheet.sheetByName a "Transactions"
        |> Task.andThen
            (\x ->
                case x of
                    Just x2 ->
                        Task.succeed x2

                    Nothing ->
                        createTransactionsSheet
            )


maybeCreateConfigSheet : AppScript.Spreadsheet.Spreadsheet -> Task.Task JavaScript.Error AppScript.Spreadsheet.Sheet
maybeCreateConfigSheet a =
    let
        createConfigSheet : Task.Task JavaScript.Error AppScript.Spreadsheet.Sheet
        createConfigSheet =
            AppScript.Spreadsheet.insertSheet a "Config"
                |> Task.andThen
                    (\x ->
                        AppScript.Spreadsheet.getRange x "A1"
                            |> Task.andThen (\x2 -> AppScript.Spreadsheet.setValue x2 (AppScript.Spreadsheet.Text "Config"))
                            |> Task.map (\_ -> x)
                    )
    in
    AppScript.Spreadsheet.sheetByName a "Config"
        |> Task.andThen
            (\x ->
                case x of
                    Just x2 ->
                        Task.succeed x2

                    Nothing ->
                        createConfigSheet
            )



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

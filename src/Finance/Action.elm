module Finance.Action exposing (..)

import AppScript.Spreadsheet
import Codec
import Json.Encode


type Action
    = Install AppScript.Spreadsheet.Event
    | Open AppScript.Spreadsheet.Event
    | Update AppScript.Spreadsheet.Event


actionCodec : Codec.Codec Action
actionCodec =
    Codec.custom
        (\fn1 fn2 fn3 x ->
            case x of
                Install x1 ->
                    fn1 x1

                Open x1 ->
                    fn2 x1

                Update x1 ->
                    fn3 x1
        )
        |> Codec.variant1 Install (Codec.build (\_ -> Json.Encode.null) AppScript.Spreadsheet.eventDecoder)
        |> Codec.variant1 Open (Codec.build (\_ -> Json.Encode.null) AppScript.Spreadsheet.eventDecoder)
        |> Codec.variant1 Update (Codec.build (\_ -> Json.Encode.null) AppScript.Spreadsheet.eventDecoder)
        |> Codec.buildCustom

module Finance.Action exposing (..)

import Codec


type Action
    = Install
    | Open
    | Update


codec : Codec.Codec Action
codec =
    Codec.custom
        (\fn1 fn2 fn3 x ->
            case x of
                Install ->
                    fn1

                Open ->
                    fn2

                Update ->
                    fn3
        )
        |> Codec.variant0 Install
        |> Codec.variant0 Open
        |> Codec.variant0 Update
        |> Codec.buildCustom

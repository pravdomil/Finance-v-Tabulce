module Finance.Action exposing (..)

import Codec


type Action
    = Install
    | Update
    | OpenTrigger
    | DailyTrigger


codec : Codec.Codec Action
codec =
    Codec.versioned "v1"
        (Codec.custom
            (\fn1 fn2 fn3 fn4 x ->
                case x of
                    Install ->
                        fn1

                    Update ->
                        fn2

                    OpenTrigger ->
                        fn3

                    DailyTrigger ->
                        fn4
            )
            |> Codec.variant0 Install
            |> Codec.variant0 Update
            |> Codec.variant0 OpenTrigger
            |> Codec.variant0 DailyTrigger
            |> Codec.buildCustom
        )

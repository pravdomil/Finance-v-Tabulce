module Finance.Action exposing (..)

import Codec
import Json.Decode


type Action
    = Install Json.Decode.Value
    | Open Json.Decode.Value
    | Update Json.Decode.Value


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
        |> Codec.variant1 Install Codec.value
        |> Codec.variant1 Open Codec.value
        |> Codec.variant1 Update Codec.value
        |> Codec.buildCustom

module Finance.Transaction exposing (..)

import Codec
import FioCz
import Time.Codec


type alias Transaction =
    { account : Account
    , transaction : FioCz.Transaction
    }



--


type alias Account =
    { name : String
    , number : String
    , bankNumber : String
    , currency : String
    }



--


codec : Codec.Codec Transaction
codec =
    Codec.versioned
        "Transaction1"
        (Codec.record (\x1 x2 -> { account = x1, transaction = x2 })
            |> Codec.field .account accountCodec
            |> Codec.field .transaction fioCzTransactionCodec
            |> Codec.buildRecord
        )


accountCodec : Codec.Codec Account
accountCodec =
    Codec.record (\x1 x2 x3 x4 -> { name = x1, number = x2, bankNumber = x3, currency = x4 })
        |> Codec.field .name Codec.string
        |> Codec.field .number Codec.string
        |> Codec.field .bankNumber Codec.string
        |> Codec.field .currency Codec.string
        |> Codec.buildRecord


fioCzTransactionCodec : Codec.Codec FioCz.Transaction
fioCzTransactionCodec =
    Codec.record (\x1 x2 x3 x4 x5 x6 x7 x8 x9 x10 x11 x12 x13 x14 x15 x16 x17 x18 x19 x20 -> { id = x1, type_ = x2, amount = x3, currency = x4, originalAmount = x5, date = x6, accountName = x7, accountNumber = x8, bankName = x9, bankNumber = x10, bankBic = x11, constantSymbol = x12, variableSymbol = x13, specificSymbol = x14, reference = x15, description = x16, message = x17, note = x18, author = x19, orderId = x20 })
        |> Codec.field .id Codec.int
        |> Codec.field .type_ Codec.string
        |> Codec.field .amount Codec.float
        |> Codec.field .currency Codec.string
        |> Codec.field .originalAmount
            (Codec.maybe
                (Codec.record (\x1 x2 -> { amount = x1, currency = x2 })
                    |> Codec.field .amount Codec.float
                    |> Codec.field .currency Codec.string
                    |> Codec.buildRecord
                )
            )
        |> Codec.field .date Time.Codec.posix
        |> Codec.field .accountName (Codec.maybe Codec.string)
        |> Codec.field .accountNumber (Codec.maybe Codec.string)
        |> Codec.field .bankName (Codec.maybe Codec.string)
        |> Codec.field .bankNumber (Codec.maybe Codec.string)
        |> Codec.field .bankBic (Codec.maybe Codec.string)
        |> Codec.field .constantSymbol (Codec.maybe Codec.string)
        |> Codec.field .variableSymbol (Codec.maybe Codec.string)
        |> Codec.field .specificSymbol (Codec.maybe Codec.string)
        |> Codec.field .reference (Codec.maybe Codec.string)
        |> Codec.field .description (Codec.maybe Codec.string)
        |> Codec.field .message (Codec.maybe Codec.string)
        |> Codec.field .note (Codec.maybe Codec.string)
        |> Codec.field .author (Codec.maybe Codec.string)
        |> Codec.field .orderId (Codec.maybe Codec.int)
        |> Codec.buildRecord

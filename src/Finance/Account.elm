module Finance.Account exposing (..)


type Account
    = Fio String String


fromString : String -> String -> Account
fromString name_ token_ =
    Fio name_ token_


name : Account -> String
name (Fio a _) =
    a


token : Account -> String
token (Fio _ a) =
    a

module Finance.FioToken exposing (..)


type FioToken
    = FioToken String String


fromString : String -> String -> FioToken
fromString name_ token_ =
    FioToken name_ token_


name : FioToken -> String
name (FioToken a _) =
    a


token : FioToken -> String
token (FioToken _ a) =
    a

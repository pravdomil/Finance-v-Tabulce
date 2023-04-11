module Finance.FioToken exposing (..)


type FioToken
    = FioToken String


fromString : String -> FioToken
fromString =
    FioToken


toString : FioToken -> String
toString (FioToken a) =
    a

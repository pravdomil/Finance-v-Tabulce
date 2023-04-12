module Finance.AccountName exposing (..)

import Dict


type alias AccountName =
    { name : String
    , account : String
    }



--


type alias Database =
    Dict.Dict String String


accountNamesToDatabase : List AccountName -> Dict.Dict String String
accountNamesToDatabase a =
    Dict.fromList (List.map (\x -> ( x.account, x.name )) a)

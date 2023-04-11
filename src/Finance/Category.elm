module Finance.Category exposing (..)

import Finance.Column


type alias Rule =
    { category : String
    , subcategory : String
    , column : Finance.Column.Column
    , contains : String
    }

module Finance.Category exposing (..)

import AppScript.Spreadsheet
import Finance.Column


type alias Category =
    { category : AppScript.Spreadsheet.Value
    , subcategory : AppScript.Spreadsheet.Value
    }



--


type alias Rule =
    { category : String
    , subcategory : String
    , column : Finance.Column.Column
    , contains : String
    }

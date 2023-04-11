module Finance.Category exposing (..)

import AppScript.Spreadsheet


type alias Category =
    { category : AppScript.Spreadsheet.Value
    , subcategory : AppScript.Spreadsheet.Value
    }

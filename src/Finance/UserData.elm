module Finance.UserData exposing (..)

import AppScript.Spreadsheet


type alias UserData =
    { category : AppScript.Spreadsheet.Value
    , subcategory : AppScript.Spreadsheet.Value
    , fulfillmentDate : AppScript.Spreadsheet.Value
    , note : AppScript.Spreadsheet.Value
    }


empty : UserData
empty =
    UserData
        (AppScript.Spreadsheet.Text "")
        (AppScript.Spreadsheet.Text "")
        (AppScript.Spreadsheet.Text "")
        (AppScript.Spreadsheet.Text "")

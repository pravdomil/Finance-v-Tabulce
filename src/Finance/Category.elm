module Finance.Category exposing (..)

import AppScript.Spreadsheet
import Finance.Column
import FioCz
import List.Extra


type alias Category =
    { category : AppScript.Spreadsheet.Value
    , subcategory : AppScript.Spreadsheet.Value
    }


categorize : List Rule -> FioCz.Transaction -> Category
categorize rules a =
    case List.Extra.find (ruleMatches a) rules of
        Just b ->
            Category (AppScript.Spreadsheet.Text b.category) (AppScript.Spreadsheet.Text b.subcategory)

        Nothing ->
            Category (AppScript.Spreadsheet.Text "") (AppScript.Spreadsheet.Text "")



--


type alias Rule =
    { category : String
    , subcategory : String
    , column : Finance.Column.Column
    , contains : String
    }

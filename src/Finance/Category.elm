module Finance.Category exposing (..)

import AppScript.Spreadsheet
import Finance.Column
import Finance.Column.Utils
import Finance.Utils
import FioCz
import List.Extra


type alias Category =
    { category : AppScript.Spreadsheet.Value
    , subcategory : AppScript.Spreadsheet.Value
    }


empty : Category
empty =
    Category (AppScript.Spreadsheet.Text "") (AppScript.Spreadsheet.Text "")


categorize : List Rule -> FioCz.Transaction -> Category
categorize rules a =
    case List.Extra.find (ruleMatches a) rules of
        Just b ->
            Category (AppScript.Spreadsheet.Text b.category) (AppScript.Spreadsheet.Text b.subcategory)

        Nothing ->
            empty



--


type alias Rule =
    { category : String
    , subcategory : String
    , column : Finance.Column.Column
    , contains : String
    }


ruleMatches : FioCz.Transaction -> Rule -> Bool
ruleMatches transaction a =
    String.contains
        (String.toLower a.contains)
        (String.toLower (Finance.Utils.valueToString (Finance.Column.Utils.transactionValue a.column empty transaction)))

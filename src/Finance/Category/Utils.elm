module Finance.Category.Utils exposing (..)

import AppScript.Spreadsheet
import Finance.Category
import Finance.Column.Utils
import Finance.Utils
import FioCz
import List.Extra


categorize : List Finance.Category.Rule -> FioCz.Transaction -> Finance.Category.Category
categorize rules a =
    case List.Extra.find (ruleMatches a) rules of
        Just b ->
            Finance.Category.Category (AppScript.Spreadsheet.Text b.category) (AppScript.Spreadsheet.Text b.subcategory)

        Nothing ->
            Finance.Category.empty


ruleMatches : FioCz.Transaction -> Finance.Category.Rule -> Bool
ruleMatches transaction a =
    String.contains
        (String.toLower a.contains)
        (String.toLower (Finance.Utils.valueToString (Finance.Column.Utils.transactionValue a.column Finance.Category.empty transaction)))

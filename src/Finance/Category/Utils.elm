module Finance.Category.Utils exposing (..)

import AppScript.Spreadsheet
import Finance.Category
import FioCz
import List.Extra


categorize : List Finance.Category.Rule -> FioCz.Transaction -> Finance.Category.Category
categorize rules a =
    case List.Extra.find (Finance.Category.ruleMatches a) rules of
        Just b ->
            Finance.Category.Category (AppScript.Spreadsheet.Text b.category) (AppScript.Spreadsheet.Text b.subcategory)

        Nothing ->
            Finance.Category.empty

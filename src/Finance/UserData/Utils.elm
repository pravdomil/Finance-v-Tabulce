module Finance.UserData.Utils exposing (..)

import AppScript.Spreadsheet
import Finance.Category
import Finance.Category.Utils
import Finance.UserData
import FioCz
import List.Extra


categorize : List Finance.Category.Rule -> FioCz.Transaction -> Finance.UserData.UserData -> Finance.UserData.UserData
categorize rules transaction a =
    case List.Extra.find (Finance.Category.Utils.ruleMatches transaction a) rules of
        Just b ->
            { a
                | category = AppScript.Spreadsheet.Text b.category
                , subcategory = AppScript.Spreadsheet.Text b.subcategory
            }

        Nothing ->
            a

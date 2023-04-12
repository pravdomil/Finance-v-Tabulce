module Finance.UserData.Utils exposing (..)

import AppScript.Spreadsheet
import Finance.AccountName
import Finance.Category
import Finance.Category.Utils
import Finance.Transaction
import Finance.UserData
import List.Extra


categorize : Finance.AccountName.Database -> List Finance.Category.Rule -> Finance.Transaction.Transaction -> Finance.UserData.UserData -> Finance.UserData.UserData
categorize accountNames rules transaction a =
    case List.Extra.find (Finance.Category.Utils.ruleMatches accountNames transaction a) rules of
        Just b ->
            { a
                | category = AppScript.Spreadsheet.Text b.category
                , subcategory = AppScript.Spreadsheet.Text b.subcategory
            }

        Nothing ->
            a

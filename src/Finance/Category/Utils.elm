module Finance.Category.Utils exposing (..)

import Finance.Category
import Finance.Column.Utils
import Finance.UserData
import Finance.Value.Utils
import FioCz


ruleMatches : FioCz.Transaction -> Finance.UserData.UserData -> Finance.Category.Rule -> Bool
ruleMatches transaction data a =
    String.contains
        (String.toLower a.contains)
        (String.toLower (Finance.Value.Utils.valueToString (Finance.Column.Utils.transactionValue a.column data transaction)))

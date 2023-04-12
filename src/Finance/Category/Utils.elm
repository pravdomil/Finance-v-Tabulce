module Finance.Category.Utils exposing (..)

import Finance.AccountName
import Finance.Category
import Finance.Column.Utils
import Finance.Transaction
import Finance.UserData
import Finance.Value.Utils


ruleMatches : Finance.AccountName.Database -> Finance.Transaction.Transaction -> Finance.UserData.UserData -> Finance.Category.Rule -> Bool
ruleMatches accountNames transaction data a =
    String.contains
        (String.toLower a.contains)
        (String.toLower (Finance.Value.Utils.valueToString (Finance.Column.Utils.transactionValue accountNames a.column data transaction)))

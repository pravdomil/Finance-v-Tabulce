module Finance.Column.Utils exposing (..)

import AppScript.Spreadsheet
import Finance.Column
import Finance.Transaction
import Finance.UserData


transactionValue : Finance.Column.Column -> Finance.UserData.UserData -> Finance.Transaction.Transaction -> AppScript.Spreadsheet.Value
transactionValue column data a =
    case column of
        Finance.Column.Account ->
            AppScript.Spreadsheet.Text a.accountName

        Finance.Column.Id ->
            AppScript.Spreadsheet.WholeNumber a.transaction.id

        Finance.Column.Type ->
            AppScript.Spreadsheet.Text a.transaction.type_

        Finance.Column.Amount ->
            AppScript.Spreadsheet.Number a.transaction.amount

        Finance.Column.Currency ->
            AppScript.Spreadsheet.Text a.transaction.currency

        Finance.Column.OriginalAmount ->
            case a.transaction.originalAmount of
                Just b ->
                    AppScript.Spreadsheet.Number b.amount

                Nothing ->
                    AppScript.Spreadsheet.Text ""

        Finance.Column.OriginalCurrency ->
            case a.transaction.originalAmount of
                Just b ->
                    AppScript.Spreadsheet.Text b.currency

                Nothing ->
                    AppScript.Spreadsheet.Text ""

        Finance.Column.Date ->
            AppScript.Spreadsheet.Date a.transaction.date

        Finance.Column.AccountName ->
            AppScript.Spreadsheet.Text (Maybe.withDefault "" a.transaction.accountName)

        Finance.Column.AccountNumber ->
            AppScript.Spreadsheet.Text (Maybe.withDefault "" a.transaction.accountNumber)

        Finance.Column.BankName ->
            AppScript.Spreadsheet.Text (Maybe.withDefault "" a.transaction.bankName)

        Finance.Column.BankNumber ->
            AppScript.Spreadsheet.Text (Maybe.withDefault "" a.transaction.bankNumber)

        Finance.Column.BankBic ->
            AppScript.Spreadsheet.Text (Maybe.withDefault "" a.transaction.bankBic)

        Finance.Column.ConstantSymbol ->
            AppScript.Spreadsheet.Text (Maybe.withDefault "" a.transaction.constantSymbol)

        Finance.Column.VariableSymbol ->
            AppScript.Spreadsheet.Text (Maybe.withDefault "" a.transaction.variableSymbol)

        Finance.Column.SpecificSymbol ->
            AppScript.Spreadsheet.Text (Maybe.withDefault "" a.transaction.specificSymbol)

        Finance.Column.Reference ->
            AppScript.Spreadsheet.Text (Maybe.withDefault "" a.transaction.reference)

        Finance.Column.Description ->
            AppScript.Spreadsheet.Text (Maybe.withDefault "" a.transaction.description)

        Finance.Column.Message ->
            AppScript.Spreadsheet.Text (Maybe.withDefault "" a.transaction.message)

        Finance.Column.Note ->
            AppScript.Spreadsheet.Text (Maybe.withDefault "" a.transaction.note)

        Finance.Column.Author ->
            AppScript.Spreadsheet.Text (Maybe.withDefault "" a.transaction.author)

        Finance.Column.OrderId ->
            case a.transaction.orderId of
                Just b ->
                    AppScript.Spreadsheet.WholeNumber b

                Nothing ->
                    AppScript.Spreadsheet.Text ""

        Finance.Column.AccountNameAndNumber ->
            AppScript.Spreadsheet.Text
                (String.trim
                    (String.join " "
                        (List.filterMap identity
                            [ a.transaction.accountName
                            , Maybe.map2 (\x x2 -> x ++ "/" ++ x2) a.transaction.accountNumber a.transaction.bankNumber
                            ]
                        )
                    )
                )

        Finance.Column.Month ->
            AppScript.Spreadsheet.Text """=DATE(YEAR(INDIRECT(ADDRESS(ROW(); MATCH("Date"; $1:$1; 0)))); MONTH(INDIRECT(ADDRESS(ROW(); MATCH("Date"; $1:$1; 0)))); 1)"""

        Finance.Column.Year ->
            AppScript.Spreadsheet.Text """=DATE(YEAR(INDIRECT(ADDRESS(ROW(); MATCH("Date"; $1:$1; 0)))); 1; 1)"""

        Finance.Column.Category ->
            data.category

        Finance.Column.Subcategory ->
            data.subcategory

        Finance.Column.FulfillmentDate ->
            data.fulfillmentDate

        Finance.Column.FulfillmentMonth ->
            AppScript.Spreadsheet.Text """=DATE(YEAR(INDIRECT(ADDRESS(ROW(); MATCH("Fulfillment Date"; $1:$1; 0)))); MONTH(INDIRECT(ADDRESS(ROW(); MATCH("Fulfillment Date"; $1:$1; 0)))); 1)"""

        Finance.Column.FulfillmentYear ->
            AppScript.Spreadsheet.Text """=DATE(YEAR(INDIRECT(ADDRESS(ROW(); MATCH("Fulfillment Date"; $1:$1; 0)))); 1; 1)"""

        Finance.Column.UserNote ->
            data.note

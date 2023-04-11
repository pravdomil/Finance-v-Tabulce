module Finance.Column.Utils exposing (..)

import AppScript.Spreadsheet
import Finance.Category
import Finance.Column
import FioCz


transactionValue : Finance.Column.Column -> Finance.Category.Category -> FioCz.Transaction -> AppScript.Spreadsheet.Value
transactionValue column category a =
    case column of
        Finance.Column.Id ->
            AppScript.Spreadsheet.WholeNumber a.id

        Finance.Column.Type ->
            AppScript.Spreadsheet.Text a.type_

        Finance.Column.Amount ->
            AppScript.Spreadsheet.Number a.amount

        Finance.Column.Currency ->
            AppScript.Spreadsheet.Text a.currency

        Finance.Column.OriginalAmount ->
            case a.originalAmount of
                Just b ->
                    AppScript.Spreadsheet.Number b.amount

                Nothing ->
                    AppScript.Spreadsheet.Text ""

        Finance.Column.OriginalCurrency ->
            case a.originalAmount of
                Just b ->
                    AppScript.Spreadsheet.Text b.currency

                Nothing ->
                    AppScript.Spreadsheet.Text ""

        Finance.Column.Date ->
            AppScript.Spreadsheet.Date a.date

        Finance.Column.AccountName ->
            AppScript.Spreadsheet.Text (Maybe.withDefault "" a.accountName)

        Finance.Column.AccountNumber ->
            AppScript.Spreadsheet.Text (Maybe.withDefault "" a.accountNumber)

        Finance.Column.BankName ->
            AppScript.Spreadsheet.Text (Maybe.withDefault "" a.bankName)

        Finance.Column.BankNumber ->
            AppScript.Spreadsheet.Text (Maybe.withDefault "" a.bankNumber)

        Finance.Column.BankBic ->
            AppScript.Spreadsheet.Text (Maybe.withDefault "" a.bankBic)

        Finance.Column.ConstantSymbol ->
            AppScript.Spreadsheet.Text (Maybe.withDefault "" a.constantSymbol)

        Finance.Column.VariableSymbol ->
            AppScript.Spreadsheet.Text (Maybe.withDefault "" a.variableSymbol)

        Finance.Column.SpecificSymbol ->
            AppScript.Spreadsheet.Text (Maybe.withDefault "" a.specificSymbol)

        Finance.Column.Reference ->
            AppScript.Spreadsheet.Text (Maybe.withDefault "" a.reference)

        Finance.Column.Description ->
            AppScript.Spreadsheet.Text (Maybe.withDefault "" a.description)

        Finance.Column.Message ->
            AppScript.Spreadsheet.Text (Maybe.withDefault "" a.message)

        Finance.Column.Note ->
            AppScript.Spreadsheet.Text (Maybe.withDefault "" a.note)

        Finance.Column.Author ->
            AppScript.Spreadsheet.Text (Maybe.withDefault "" a.author)

        Finance.Column.OrderId ->
            case a.orderId of
                Just b ->
                    AppScript.Spreadsheet.WholeNumber b

                Nothing ->
                    AppScript.Spreadsheet.Text ""

        Finance.Column.Account ->
            AppScript.Spreadsheet.Text
                (String.trim
                    (String.join " "
                        (List.filterMap identity
                            [ a.accountName
                            , Maybe.map2 (\x x2 -> x ++ "/" ++ x2) a.accountNumber a.bankNumber
                            ]
                        )
                    )
                )

        Finance.Column.Month ->
            AppScript.Spreadsheet.Text """=DATE(YEAR(INDIRECT(ADDRESS(ROW(), MATCH("Date", $1:$1, 0)))), MONTH(INDIRECT(ADDRESS(ROW(), MATCH("Date", $1:$1, 0)))), 1)"""

        Finance.Column.Year ->
            AppScript.Spreadsheet.Text """=DATE(YEAR(INDIRECT(ADDRESS(ROW(), MATCH("Date", $1:$1, 0)))), 1, 1)"""

        Finance.Column.Category ->
            category.category

        Finance.Column.Subcategory ->
            category.subcategory

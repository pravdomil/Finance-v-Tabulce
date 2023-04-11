module Finance.Column exposing (..)


type Column
    = Id
    | Type
    | Amount
    | Currency
    | OriginalAmount
    | OriginalCurrency
    | Date
      --
    | AccountName
    | AccountNumber
      --
    | BankName
    | BankNumber
    | BankBic
      --
    | ConstantSymbol
    | VariableSymbol
    | SpecificSymbol
    | Reference
      --
    | Description
    | Message
    | Note
      --
    | Author
    | OrderId
      --
    | Account
    | Month
    | Year
      --
    | Category
    | Subcategory
    | FulfillmentDate


fromString : String -> Maybe Column
fromString a =
    case String.toLower a of
        "id" ->
            Just Id

        "type" ->
            Just Type

        "amount" ->
            Just Amount

        "currency" ->
            Just Currency

        "original amount" ->
            Just OriginalAmount

        "original currency" ->
            Just OriginalCurrency

        "date" ->
            Just Date

        "account name" ->
            Just AccountName

        "account number" ->
            Just AccountNumber

        "bank name" ->
            Just BankName

        "bank number" ->
            Just BankNumber

        "bank bic" ->
            Just BankBic

        "constant symbol" ->
            Just ConstantSymbol

        "variable symbol" ->
            Just VariableSymbol

        "specific symbol" ->
            Just SpecificSymbol

        "reference" ->
            Just Reference

        "description" ->
            Just Description

        "message" ->
            Just Message

        "note" ->
            Just Note

        "author" ->
            Just Author

        "order id" ->
            Just OrderId

        "account" ->
            Just Account

        "month" ->
            Just Month

        "year" ->
            Just Year

        "category" ->
            Just Category

        "subcategory" ->
            Just Subcategory

        "fulfillment date" ->
            Just FulfillmentDate

        _ ->
            Nothing

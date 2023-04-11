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


fromString : String -> Maybe Column
fromString a =
    case a of
        "ID" ->
            Just Id

        "Type" ->
            Just Type

        "Amount" ->
            Just Amount

        "Currency" ->
            Just Currency

        "Original Amount" ->
            Just OriginalAmount

        "Original Currency" ->
            Just OriginalCurrency

        "Date" ->
            Just Date

        "Account Name" ->
            Just AccountName

        "Account Number" ->
            Just AccountNumber

        "Bank Name" ->
            Just BankName

        "Bank Number" ->
            Just BankNumber

        "Bank BIC" ->
            Just BankBic

        "Constant Symbol" ->
            Just ConstantSymbol

        "Variable Symbol" ->
            Just VariableSymbol

        "Specific Symbol" ->
            Just SpecificSymbol

        "Reference" ->
            Just Reference

        "Description" ->
            Just Description

        "Message" ->
            Just Message

        "Note" ->
            Just Note

        "Author" ->
            Just Author

        "Order ID" ->
            Just OrderId

        "Account" ->
            Just Account

        _ ->
            Nothing

module Finance.Config exposing (..)

import Finance.Account
import Finance.Category
import Finance.Column
import Parser


type Config
    = Account Finance.Account.Account
    | CategoryRule Finance.Category.Rule


accounts : List Config -> List Finance.Account.Account
accounts a =
    List.filterMap
        (\x ->
            case x of
                Account x2 ->
                    Just x2

                _ ->
                    Nothing
        )
        a


categoryRules : List Config -> List Finance.Category.Rule
categoryRules a =
    List.filterMap
        (\x ->
            case x of
                CategoryRule x2 ->
                    Just x2

                _ ->
                    Nothing
        )
        a


singleParser : Parser.Parser Config
singleParser =
    Parser.getChompedString (Parser.chompWhile (\x -> x /= ':' && x /= '\n'))
        |> Parser.andThen
            (\name ->
                case String.toLower name of
                    "account" ->
                        Parser.token ":"
                            |> Parser.andThen (\() -> accountParser)
                            |> Parser.map Account

                    "rule" ->
                        Parser.token ":"
                            |> Parser.andThen (\() -> ruleParser)
                            |> Parser.map CategoryRule

                    _ ->
                        Parser.problem ("Unknown config " ++ name ++ ".")
            )


multipleParser : Parser.Parser (List Config)
multipleParser =
    Parser.loop
        []
        (\x ->
            Parser.oneOf
                [ Parser.end
                    |> Parser.map (\() -> Parser.Done (List.reverse x))
                , Parser.symbol "\n"
                    |> Parser.map (\() -> Parser.Loop x)
                , singleParser
                    |> Parser.map (\x2 -> Parser.Loop (x2 :: x))
                ]
        )



--


accountParser : Parser.Parser Finance.Account.Account
accountParser =
    Parser.succeed Finance.Account.fromString
        |> Parser.andThen (\x -> spaces |> Parser.map (\() -> x))
        |> Parser.andThen (\x -> Parser.symbol "\"fio\"" |> Parser.map (\() -> x))
        |> Parser.andThen (\x -> spaces |> Parser.map (\() -> x))
        |> Parser.andThen (\x -> quotedText |> Parser.map (\x2 -> x x2))
        |> Parser.andThen (\x -> spaces |> Parser.map (\() -> x))
        |> Parser.andThen (\x -> quotedText |> Parser.map (\x2 -> x x2))
        |> Parser.andThen (\x -> spaces |> Parser.map (\() -> x))


ruleParser : Parser.Parser Finance.Category.Rule
ruleParser =
    let
        column : Parser.Parser Finance.Column.Column
        column =
            quotedText
                |> Parser.andThen
                    (\x ->
                        case Finance.Column.fromString x of
                            Just x2 ->
                                Parser.succeed x2

                            Nothing ->
                                Parser.problem ("Unknown column " ++ x ++ ".")
                    )
    in
    Parser.succeed Finance.Category.Rule
        |> Parser.andThen (\x -> spaces |> Parser.map (\() -> x))
        |> Parser.andThen (\x -> quotedText |> Parser.map (\x2 -> x x2))
        |> Parser.andThen (\x -> spaces |> Parser.map (\() -> x))
        |> Parser.andThen (\x -> quotedText |> Parser.map (\x2 -> x x2))
        |> Parser.andThen (\x -> spaces |> Parser.map (\() -> x))
        |> Parser.andThen (\x -> column |> Parser.map (\x2 -> x x2))
        |> Parser.andThen (\x -> spaces |> Parser.map (\() -> x))
        |> Parser.andThen (\x -> quotedText |> Parser.map (\x2 -> x x2))
        |> Parser.andThen (\x -> spaces |> Parser.map (\() -> x))



--


spaces : Parser.Parser ()
spaces =
    Parser.chompWhile (\x -> x == ' ')


quotedText : Parser.Parser String
quotedText =
    Parser.symbol "\""
        |> Parser.andThen (\() -> Parser.getChompedString (Parser.chompWhile (\x -> x /= '"' && x /= '\n')))
        |> Parser.andThen (\x -> Parser.symbol "\"" |> Parser.map (\() -> x))

module Finance.Config exposing (..)

import Finance.Category
import Finance.Column
import Finance.FioToken
import Parser


type Config
    = FioToken_ Finance.FioToken.FioToken
    | CategoryRule_ Finance.Category.Rule


fioTokens : List Config -> List Finance.FioToken.FioToken
fioTokens a =
    List.filterMap
        (\x ->
            case x of
                FioToken_ x2 ->
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
                CategoryRule_ x2 ->
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
                    "fio token" ->
                        Parser.token ":"
                            |> Parser.andThen (\() -> fioTokenParser)
                            |> Parser.map FioToken_

                    "rule" ->
                        Parser.token ":"
                            |> Parser.andThen (\() -> ruleParser)
                            |> Parser.map CategoryRule_

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


fioTokenParser : Parser.Parser Finance.FioToken.FioToken
fioTokenParser =
    Parser.succeed Finance.FioToken.fromString
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

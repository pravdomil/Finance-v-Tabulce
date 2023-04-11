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
                            |> Parser.andThen (\() -> Parser.getChompedString (Parser.chompWhile (\x -> x /= '\n')))
                            |> Parser.map (\x -> FioToken_ (Finance.FioToken.fromString (String.trim x)))

                    "rule" ->
                        Parser.token ":"
                            |> Parser.andThen (\() -> Parser.getChompedString (Parser.chompWhile (\x -> x /= '\n')))
                            |> Parser.map (\_ -> CategoryRule_ (Finance.Category.Rule "" "" Finance.Column.Id ""))

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

module Finance.Config exposing (..)

import Parser


type Config
    = FioToken String
    | Rule String


fioTokens : List Config -> List String
fioTokens a =
    List.filterMap
        (\x ->
            case x of
                FioToken x2 ->
                    Just x2

                _ ->
                    Nothing
        )
        a


rules : List Config -> List String
rules a =
    List.filterMap
        (\x ->
            case x of
                Rule x2 ->
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
                            |> Parser.map (\x -> FioToken (String.trim x))

                    "rule" ->
                        Parser.token ":"
                            |> Parser.andThen (\() -> Parser.getChompedString (Parser.chompWhile (\x -> x /= '\n')))
                            |> Parser.map (\x -> Rule (String.trim x))

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

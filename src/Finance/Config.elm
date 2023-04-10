module Finance.Config exposing (..)

import Parser


type Config
    = FioToken String
    | Rule String


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
                , Parser.symbol "Config\n"
                    |> Parser.map (\() -> Parser.Loop x)
                , singleParser
                    |> Parser.map (\x2 -> Parser.Loop (x2 :: x))
                ]
        )

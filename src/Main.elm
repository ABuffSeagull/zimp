module Main exposing (main)

import Browser
import Element exposing (..)


main : Program () Model Msg
main =
    Browser.document
        { init = init
        , subscriptions = subscriptions
        , update = update
        , view = view
        }


type alias Model =
    {}


init _ =
    ( {}, Cmd.none )


subscriptions _ =
    Sub.none


type Msg
    = Nothing


update _ _ =
    ( {}, Cmd.none )


view _ =
    { title = "ZimP"
    , body =
        List.singleton <|
            layout [] <|
                none
    }

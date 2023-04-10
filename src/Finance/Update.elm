module Finance.Update exposing (..)

import AppScript.Spreadsheet
import Finance.Config
import JavaScript
import Task


transactions : AppScript.Spreadsheet.Sheet -> List Finance.Config.Config -> Task.Task JavaScript.Error ()
transactions _ _ =
    Task.succeed ()

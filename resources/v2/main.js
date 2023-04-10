/*
 * Finance v Tabulce
 *
 * https://github.com/pravdomil/finance-v-tabulce
 *
 */

var financeUrl =
  "https://raw.githubusercontent.com/pravdomil/finance-v-tabulce/master/dist/v2/finance.js"

function onOpen() {
  // simple triggers can't do anything that requires authorization
  SpreadsheetApp.getUi().createMenu("Finance v Tabulce").addItem("Install", "onInstall").addToUi()
}

function onInstall(e) {
  eval(UrlFetchApp.fetch(financeUrl).getContentText())
  Elm.Main.init({ flags: { action: [0, e] } })
}

function onCustomOpen(e) {
  eval(UrlFetchApp.fetch(financeUrl).getContentText())
  Elm.Main.init({ flags: { action: [1, e] } })
}

function onDailyTrigger(e) {
  eval(UrlFetchApp.fetch(financeUrl).getContentText())
  Elm.Main.init({ flags: { action: [2, e] } })
}
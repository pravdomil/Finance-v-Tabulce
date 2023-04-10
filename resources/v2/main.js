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

function onCustomOpen(e) {
  eval(UrlFetchApp.fetch(financeUrl).getContentText())
  Elm.Main.init({ flags: { name: "onCustomOpen", event: e } })
}

function onDailyTrigger(e) {
  eval(UrlFetchApp.fetch(financeUrl).getContentText())
  Elm.Main.init({ flags: { name: "onDailyTrigger", event: e } })
}

function onInstall(e) {
  eval(UrlFetchApp.fetch(financeUrl).getContentText())
  Elm.Main.init({ flags: { name: "onInstall", event: e } })
}

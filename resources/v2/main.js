/*
 * Finance v Tabulce
 *
 * https://github.com/pravdomil/finance-v-tabulce
 *
 */

var financeUrl =
  "https://raw.githubusercontent.com/pravdomil/finance-v-tabulce/master/dist/v2/finance.js"

function checkFn() {
  console.info(typeof Elm === "object" ? "Finance is ready." : "Finance is not ready.")
}

try {
  eval(UrlFetchApp.fetch(financeUrl).getContentText())
} catch (e) {
  console.error(e)
}

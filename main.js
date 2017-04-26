/*
Finance v tabulce
Authors: Filip Hráček, Pravdomil Toman

https://github.com/pravdomil/finance-v-tabulce

*/

// custom onOpen trigger
function customOnOpen() {
  finInit()
}

// daily trigger
function dailyTrigger() {
  finDailyTrigger()
}


// onOpen trigger
function onOpen() {
  // simple triggers can't do anything that requires authorization
  // so make option to install custom onOpen trigger that can do everything
  SpreadsheetApp.getUi().createMenu('Finance').addItem('Instalovat', 'install').addToUi()
}

// install custom onOpen trigger
function install() {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var config = PropertiesService.getDocumentProperties()
  
  // setup custom onOpen trigger
  if(!config.getProperty("openTriggerSet")) {
    ScriptApp.newTrigger("customOnOpen").forSpreadsheet(ss).onOpen().create()
    config.setProperty("openTriggerSet", true)
  }
  
  // run custom trigger
  customOnOpen()
}

// google.script.host bridge
function finBridge(args) {
  return eval(args.obj)[args.func](args)
}

// try to load core if possible
try {
  // load core from cdn
  var core = "https://raw.githubusercontent.com/pravdomil/finance-v-tabulce/master/finance.js"
  core = UrlFetchApp.fetch(core).getContentText()
  
  // run
  eval(core)
}
catch(e) {
  // throw e
  Logger.log(e)
}

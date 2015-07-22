/*

Fio výpis účtu

Authors: Filip Hráček, Pravdomil Toman

https://github.com/Pravdomil/Fio-API-SpreadsheetApp

*/

function onOpen() {
	// simple triggers can't do anything that requires authorization
	// so make option to install custom onOpen trigger
	SpreadsheetApp.getUi().createMenu('Fio').addItem('Instalovat', 'install').addToUi();
}

function customOnOpen() {
	// custom onOpen trigger, we can do everything
	// fio core is loaded so replace the menu
	fioMenu();
}

function update() {
	// all trigger functions must be visible before fio core init
	fioUpdate();
}

function install() {
	
	var ss = SpreadsheetApp.getActiveSpreadsheet();
	var config = PropertiesService.getDocumentProperties();
	
	// setup custom onOpen trigger
	if(!config.getProperty("openTriggerSet"))
	{
		ScriptApp.newTrigger("customOnOpen").forSpreadsheet(ss).onOpen().create();
		config.setProperty("openTriggerSet", true);
	}
	
	// fio core is loaded so replace the menu
	fioMenu();
}


// try to load fio core if possible
try {

	// load core from cdn
	var fio_js = "https://cdn.rawgit.com/Pravdomil/Fio-API-SpreadsheetApp/master/fio.js";
	fio_js = UrlFetchApp.fetch(fio_js).getContentText();
	
	// run
	eval(fio_js);
	
}
catch(e)
{
	//throw e; // uncomment for debug
	Logger.log(e);
}

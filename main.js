function onOpen() {
    SpreadsheetApp.getUi().createMenu('Fio')
        .addItem('Aktualizovat', 'update')
        .addItem('Rozčlenit', 'categorize')
        .addSeparator()
        .addItem('Nastavit token', 'setToken')
        .addSeparator()
        .addItem('Zanést hotovost', 'trackCash')
        .addToUi();
}

function update() {
    fio.update();
    fio.categorize();
}

function categorize() {
    fio.categorize();
}

function setToken() {
    fioApi.promptToken();
}

function trackCash() {
    
    var amount = parseInt(Browser.inputBox('Částka'));
    if(!amount) return;
    
    var date = new Date();
    date = date.getDate() + "." + ( date.getMonth() + 1 ) + "." + date.getFullYear();
    
    var arr = [
		{
			"Datum" : date,
			"Objem" : fioCategory.docsNumber(amount),
			"Měna" : "CZK",
			"Typ pohybu" : "cash",
		},
		{
			"Datum" : date,
			"Objem" : fioCategory.docsNumber(amount * -1),
			"Měna" : "CZK",
			"Typ pohybu" : "cash",
		}
	];
	
    fio.insert(arr);
    
    fio.categorize();
}

function onOpen() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    ss.addMenu("Fio", [
        {name: "Update", functionName: "update"},
        {name: "Categorize", functionName: "categorize"},
        {name: "Track cash", functionName: "trackCash"},
    ]);
}

function update() {
    fio.update();
}

function categorize() {
    fio.categorize();
}

function trackCash() {
    
    var amount = parseInt(Browser.inputBox('Amount'));
    if(!amount) return;
    
    var date = new Date();
    date = date.getDate() + "." + ( date.getMonth() + 1 ) + "." + date.getFullYear();
    
    var arr = [
        [date, docsNumber(amount), 'CZK', '', '', '', '', '', 'cash'],
        [date, docsNumber(amount * -1), 'CZK', '', '', '', '', '', 'cash'],
    ];
    fio.insert(arr);
    
    fio.categorize();
}


function fioMenu() {
    SpreadsheetApp.getUi().createMenu('Fio')
        .addItem('Aktualizovat', 'fioUpdate')
        .addItem('Rozčlenit', 'fioCategorize')
        .addSeparator()
        .addItem('Nastavit token', 'setToken')
        .addSeparator()
        .addItem('Zanést hotovost', 'trackCash')
        .addToUi();
}

function fioUpdate() {
    fio.update();
    fio.categorize();
}

function fioCategorize() {
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
			"Objem" : amount,
			"Měna" : "CZK",
			"Typ pohybu" : "cash",
		},
		{
			"Datum" : date,
			"Objem" : amount * -1,
			"Měna" : "CZK",
			"Typ pohybu" : "cash",
		}
	];
	
    fio.insert(arr);
    
    fio.categorize();
}


/////////////////////////


var fioColumns = new function() {
    
    this.obj = {
        'column0': 'Datum',
        'column1': 'Objem',
        'column14': 'Měna',
        'column2': 'Protiúčet',
        'column3': 'Kód banky',
        'column4': 'KS',
        'column5': 'VS',
        'column6': 'SS',
        'column8': 'Typ pohybu',
        'column16': 'Zpráva pro příjemce',
        'column7': 'Uživatelská identifikace',
        'column25': 'Komentář',
        'column10': 'Název protiúčtu',
        'column12': 'Název banky',
        'column18': 'Upřesnění',
        'column9': 'Provedl',
        'column26': 'BIC',
        'column17': 'ID pokynu',
        'column22': 'ID pohybu',
    }
    
    this.arr = [];
    for (var key in this.obj) this.arr.push(this.obj[key]);
    
    this.arr.push("Pohyb");
    this.arr.push("Částka");
	this.arr.push("Charakter");
    this.arr.push("Skupina");
    this.arr.push("Věc");
    this.arr.push("Předatovat");
    this.arr.push("Měsíc");
    this.arr.push("Rok");
}


var fioRules = new function() {
    
    this.emptySheet = function() {
        
        var template = SpreadsheetApp.openById('1pj6zDR6Bh2Zg5DTMQFfa69yiS4np0WqUceuKsEL7jSA');
		return template.getSheetByName("kategorie").copyTo(fio.ss).setName("kategorie");
    }
	
    this.load = function() {
        
		if(!fio.ss) return;
		
        this.sheet = fio.ss.getSheetByName("kategorie") || this.emptySheet();
        
        this.parse(this.sheet.getRange("A:G").getValues());
    }
    
    this.parse = function(array) {
        
        this.rules = [];
        
        for(var i = 1; i < array.length; i++) {
    
            var group = array[i][0];
            var item = array[i][1];
            var character = array[i][5];
			var comment = array[i][6];
            
            if(!group) continue;
            
            var cond = [];
            while(true)
            {
                var obj = {
                    column : array[i][2],
                    mode : array[i][3],
                    value : String(array[i][4]),
                }
                
                if(obj.column) cond.push(obj);
                
                if(array[i + 1][2] != "+") break;
                
                i += 2;
            }
            
            if(cond.length) this.rules.push({
                group : group,
                item : item,
                cond : cond,
                character : character,
				comment : comment,
            })
        }
    }
    
    this.get = function(row) {
        
        for(var i = 0; i < this.rules.length; i++) {
            
            var rule = this.rules[i];
            var passed = false;
            
            for(var c = 0; c < rule.cond.length; c++) {
                
                var cond = rule.cond[c];
                
                switch(cond.mode) {
                    case "=":
                        passed = (row[cond.column] == cond.value);
                        break;
                    
                    case "~":
                        var regex = new RegExp( this.escapeRegExp(cond.value), "i");
                        passed = regex.test(row[cond.column]);
                        break;
                        
                    case "<":
                        passed = (row[cond.column] < cond.value);
                        break;
                        
                    case ">":
                        passed = (row[cond.column] > cond.value);
                        break;
                }
                
                if(!passed) break;
            }
            
            if(passed) return rule;
        }
    }
    
    this.escapeRegExp = function(s) {
        return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
    }
    
}


var fioApi = new function() {
    
    this.config = PropertiesService.getScriptProperties();
    this.token = this.config.getProperty("token");
    
    this.promptToken = function() {
        
        this.token = Browser.inputBox('Zadejte token');
        if(this.token == "cancel") this.token = null;
        
        if(this.token !== null) this.config.setProperty('token', this.token);
        
        return this.token;
    }
    
    this.api = function(arg) {
        
        if (!this.token && !this.promptToken())
        {
            if(this.token === null) return {};
            
            throw "Token není nastaven.";
        }
        
        var response = UrlFetchApp.fetch("https://www.fio.cz/ib_api/rest/last/" + this.token + "/" + arg + ".json");
        
        if (response.getResponseCode() != 200) throw "Nepodařilo se spojit se serverem.";
        
        return Utilities.jsonParse(response.getContentText()).accountStatement;
    }
    
    this.getLatestTransaction = function() {
        
        var json = this.api("transactions");
        
        if (!json.transactionList) return;
        
        var list = json.transactionList.transaction;
        
        var trans = [];
        
        for (var i = 0; i < list.length; i++) {
            
            var obj = list[i];
            
            trans[i] = {};
            
            for (var key in fioColumns.obj) {
                
                var val = obj[key];
                var column = fioColumns.obj[key];
                
                if(!val) val = "";
                else if(column == "Datum") val = val.value.replace(/\+[0-9]+/, "");
                else val = val.value;
                
                trans[i][column] = val;
            }
        }
        
        return trans.reverse();
    }
}


var fioCategory = new function() {
    
    this.resolve = function(sheet) {
        
        this.sheet = sheet;
        
        var range = this.sheet.getRange(2, 1, this.sheet.getMaxRows()-1, fio.columns.length);
        var data = range.getValues();
        
        for(var r = 0; r < data.length; r++) {
            
            var modified = this.categorize(data[r]);
            
            for(var key in modified) {
                
                var ci = fio.columnIndex(key);
                if(ci) this.sheet.getRange(2 + r, ci).setValue(modified[key]);
                
            }
        }
    }
    
    this.categorize = function(rowArr) {
        
        var row = this.rowToObj(rowArr);
        var obj = {};
		
		var f = function(arg) {
		    return arg.replace(/FIO_[A-ž_]+/g, function(match, contents, offset, s)
		        {
		            match = match.replace(/FIO_/, "");
		            match = match.replace(/_/, " ");
            		
		            return 'INDIRECT(ADDRESS(ROW(); MATCH("' + match + '"; $1:$1; 0)))';
		        }
		    );
		}
        
        if(row["Pohyb"] === "") obj["Pohyb"] = row["Objem"] < 0 ? "Výdaj" : "Příjem";
		if(row["Částka"] === "") obj["Částka"] = f('=ABS(FIO_OBJEM)');
		if(row["Charakter"] === "") {
			obj["Charakter"] = f('=IF(FIO_VĚC = ""; "Navíc"; "Běžné")');
        }
		
        if(row["Předatovat"] === "") obj["Předatovat"] = row["Datum"];
        if(row["Měsíc"] === "") {
			obj["Měsíc"] = f('=IF(FIO_PŘEDATOVAT; DATE(YEAR(FIO_PŘEDATOVAT); MONTH(FIO_PŘEDATOVAT); 1); "")');
		}
        if(row["Rok"] === "") {
			obj["Rok"] = f('=IF(FIO_PŘEDATOVAT; YEAR(FIO_PŘEDATOVAT); "")');
		}
		
		if(row["Komentář"] !== undefined && row["Komentář"].trim() === "")
		{
			if(row["Zpráva pro příjemce"]) obj["Komentář"] = row["Zpráva pro příjemce"];
			else if(row["Uživatelská identifikace"]) obj["Komentář"] = row["Uživatelská identifikace"];
		}
        
        if(row["Skupina"] == "" && row["Věc"] == "") {
            
            var rule = fioRules.get(row);
            
            if(rule) {
                obj["Skupina"] = rule.group;
                obj["Věc"] = rule.item;
                
                if(rule.character) obj["Charakter"] = rule.character;
				if(row["Komentář"] === "") obj["Komentář"] = rule.comment;
            }
        }
  
        return obj;
    }
    
    this.rowToObj = function(arr) {
        
        var obj = {};
        
        for(var i = 0; i < fio.columns.length; i++) {
            
            var column = fio.columns[i];
            
            obj[column] = arr[i];
        }
        
        return obj;
    }
    
}


var fioTrigger = new function() {
    try
    {
        this.config = PropertiesService.getScriptProperties();
    
        if(this.config.getProperty("triggerSet")) return;
    
        ScriptApp.newTrigger('update').timeBased().atHour(5).everyDays(1).create();
    
        this.config.setProperty("triggerSet", true);
    }
    catch (e) {}
}


var fio = new function() {
    
    this.emptySheet = function() {
        
        var template = SpreadsheetApp.openById('1pj6zDR6Bh2Zg5DTMQFfa69yiS4np0WqUceuKsEL7jSA');
		return template.getSheetByName("db").copyTo(this.ss).setName("db").activate();
    }
	
    this.balanceSheet = function() {
        
        var template = SpreadsheetApp.openById('1pj6zDR6Bh2Zg5DTMQFfa69yiS4np0WqUceuKsEL7jSA');
		return template.getSheetByName("zůstatek").copyTo(this.ss).setName("zůstatek");
    }
    
    this.update = function() {
        
        var latest = fioApi.getLatestTransaction();
        
        this.insert(latest);
    }
    
    this.categorize = function() {
        
        fioCategory.resolve(this.sheet);
        
    }
    
    this.insert = function(data) {
        if(!data) return;
        
        for(var i = 0; i < data.length; i++) {
            
            var row = new Array(fio.columns.length);
            
            for(var c = 0; c < row.length; c++) {
                
                var column = fio.columns[c];
                var value = data[i][column];
                
                row[c] = value ? value : "";
            }
            
            this.sheet.insertRowsAfter(1, 1);
            this.sheet.getRange("2:2").setValues([row]);
            
        }
    }
    
    this.columnIndex = function(name) {
        
        name = String(name).toLowerCase();
        
        for(var i = 0; i < this.columns.length; i++) {
        
            if(String(this.columns[i]).toLowerCase() == name) return i + 1;
        
        }
        
        return null;
    }
    
    this.ss = SpreadsheetApp.getActive();
    if(this.ss)
	{
		this.sheet = this.ss.getSheetByName("db") || this.emptySheet();
		
		this.balance = this.ss.getSheetByName("zůstatek") || this.balanceSheet();
    	
    	this.columns = this.sheet.getRange("1:1").getValues()[0];
	}
}

fioRules.load();



function FIO_QUERY(arg) {
    
    return arg.replace(/FIO_[A-ž_]+/g, function(match, contents, offset, s)
        {
            match = match.replace(/FIO_/, "");
            match = match.replace(/_/, " ");
            
            return String.fromCharCode(97 + fio.columnIndex(match) - 1).toUpperCase();
        }
    );
}

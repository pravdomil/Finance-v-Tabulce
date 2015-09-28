function finInit() {
	finMenu();
}

function finDailyTrigger() {
	finRefresh();
}

function finMenu() {
    SpreadsheetApp.getUi().createMenu('Finance')
        .addItem('Aktualizovat', 'finRefresh')
        .addItem('Rozčlenit', 'finCategorize')
        .addSeparator()
        .addItem('Nastavení', 'finConfigShow')
        .addSeparator()
        .addItem('Zanést hotovost', 'trackCash')
        .addToUi();
}

function finRefresh() {
    fin.refresh();
    fin.categorize();
}

function finCategorize() {
    fin.categorize();
}

function finConfigShow() {
	finConfig.show();
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
	
    fin.insert(arr);
    
    fin.categorize();
}


/////////////////////////


var fin = new function() {
	
    this.config = PropertiesService.getDocumentProperties();

    this.emptySheet = function() {
        
        var template = SpreadsheetApp.openById('1pj6zDR6Bh2Zg5DTMQFfa69yiS4np0WqUceuKsEL7jSA');
		return template.getSheetByName("db").copyTo(this.ss).setName("db").activate();
    }
	
    this.balanceSheet = function() {
        
        var template = SpreadsheetApp.openById('1pj6zDR6Bh2Zg5DTMQFfa69yiS4np0WqUceuKsEL7jSA');
		return template.getSheetByName("zůstatek").copyTo(this.ss).setName("zůstatek");
    }
    
    this.refresh = function() {
        
        this.insert( fioApi.getLatestTransaction() );
		
		this.insert( airApi.getLatestTransaction() );
    }
    
    this.categorize = function() {
        
        finCategory.resolve(this.sheet);
        
    }
    
    this.insert = function(data) {
        if(!data) return;
        
        for(var i = 0; i < data.length; i++) {
            
            var row = new Array(fin.columns.length);
            
            for(var c = 0; c < row.length; c++) {
                
                var column = fin.columns[c];
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
	
	this.getIds = function() {
		
		var uniqueCol = this.columnIndex("ID pohybu");
		var ids = this.sheet.getRange(2, uniqueCol, this.sheet.getMaxRows()-1, 1).getValues();
		
		 // flatten and convert to string
		for (var i = 0; i < ids.length; i++) ids[i] = ids[i][0] + "";
        
		return ids;
	}
    
    this.ss = SpreadsheetApp.getActive();
    if(this.ss)
	{
		this.sheet = this.ss.getSheetByName("db") || this.emptySheet();
		
		this.balance = this.ss.getSheetByName("zůstatek") || this.balanceSheet();
    	
    	this.columns = this.sheet.getRange("1:1").getValues()[0];
	}
}


var finRules = new function() {
    
    this.emptySheet = function() {
        
        var template = SpreadsheetApp.openById('1pj6zDR6Bh2Zg5DTMQFfa69yiS4np0WqUceuKsEL7jSA');
		return template.getSheetByName("kategorie").copyTo(fin.ss).setName("kategorie");
    }
	
    this.load = function() {
        
		if(!fin.ss) return;
		
        this.sheet = fin.ss.getSheetByName("kategorie") || this.emptySheet();
        
        this.parse(this.sheet.getRange("A:G").getValues());
    }
    
    this.parse = function(array) {
        
        this.rules = [];
        
        for(var i = 1; i < array.length; i++) {
    
            var group = array[i][0];
            var item = array[i][1];
            var character = array[i][5];
			var note = array[i][6];
            
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
				note : note,
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


var finCategory = new function() {
    
    this.resolve = function(sheet) {
        
        this.sheet = sheet;
        
        var range = this.sheet.getRange(2, 1, this.sheet.getMaxRows()-1, fin.columns.length);
        var data = range.getValues();
        
        for(var r = 0; r < data.length; r++) {
            
            var modified = this.categorize(data[r]);
            
            for(var key in modified) {
                
                var ci = fin.columnIndex(key);
                if(ci) this.sheet.getRange(2 + r, ci).setValue(modified[key]);
                
            }
        }
    }
    
    this.categorize = function(rowArr) {
        
        var row = this.rowToObj(rowArr);
        var obj = {};
		
		var f = function(arg) {
		    return arg.replace(/FIN_[A-ž_]+/g, function(match, contents, offset, s)
		        {
		            match = match.replace(/FIN_/, "");
		            match = match.replace(/_/, " ");
            		
		            return 'INDIRECT(ADDRESS(ROW(); MATCH("' + match + '"; $1:$1; 0)))';
		        }
		    );
		}
        
        if(row["Pohyb"] === "") obj["Pohyb"] = row["Objem"] < 0 ? "Výdaj" : "Příjem";
		if(row["Částka"] === "") obj["Částka"] = f('=ABS(FIN_OBJEM)');
		if(row["Charakter"] === "") {
			obj["Charakter"] = f('=IF(FIN_VĚC = ""; "Navíc"; "Výdaje")');
        }
		
        if(row["Předatovat"] === "") obj["Předatovat"] = row["Datum"];
        if(row["Měsíc"] === "") {
			obj["Měsíc"] = f('=IF(FIN_PŘEDATOVAT; DATE(YEAR(FIN_PŘEDATOVAT); MONTH(FIN_PŘEDATOVAT); 1); "")');
		}
        if(row["Rok"] === "") {
			obj["Rok"] = f('=IF(FIN_PŘEDATOVAT; YEAR(FIN_PŘEDATOVAT); "")');
		}
		
		if(row["Poznámka"] !== undefined && String(row["Poznámka"]).trim() === "")
		{
			if(row["Zpráva pro příjemce"]) obj["Poznámka"] = row["Zpráva pro příjemce"];
			else if(row["Účel"]) obj["Poznámka"] = row["Účel"];
		}
        
        if(row["Skupina"] == "" && row["Věc"] == "") {
            
            var rule = finRules.get(row);
            
            if(rule) {
                obj["Skupina"] = rule.group;
                obj["Věc"] = rule.item;
                
                if(rule.character) obj["Charakter"] = rule.character;
				if(obj["Poznámka"] === "") obj["Poznámka"] = rule.note;
            }
        }
  
        return obj;
    }
    
    this.rowToObj = function(arr) {
        
        var obj = {};
        
        for(var i = 0; i < fin.columns.length; i++) {
            
            var column = fin.columns[i];
            
            obj[column] = arr[i];
        }
        
        return obj;
    }
    
}


var finTrigger = new function() {
    try
    {
        if(fin.config.getProperty("triggerSet")) return;
    
        ScriptApp.newTrigger('dailyTrigger').timeBased().atHour(6).everyDays(1).create();
    
        fin.config.setProperty("triggerSet", true);
    }
    catch (e) {}
}


var finConfig = new function() {
	
	this.show = function() {
		var html = '\
<style>\
*{padding: 0;margin: 0;border: 0;position: relative;box-sizing: border-box;vertical-align: bottom;color: inherit;font: inherit;text-decoration: inherit;letter-spacing: inherit;word-spacing: inherit;text-transform: inherit;}\
input,button,textarea,select,.button{display: inline-block;padding: 0.5rem;height: 2rem;border: 1px solid;-webkit-border-radius: .25rem;border-radius: .25rem;background-clip: padding-box;background-color: #FFF}input[type="submit"]{cursor: pointer}.button{text-align: center;font-weight:normal;}\
html{ font-family: sans-serif; font-size: 17px; }\
body { font-size: 14px; line-height: 1rem; }\
b, a { font-weight: bold; }\
*:target { display: block !important; }\
#fio, #air, *:target ~ form { display: none; }\
</style>\
<b>Finance v tabulce</b><br><br>\
<form id="fio" onsubmit="google.script.run.finBridge(this);google.script.host.close();">\
	Přihlašte se do internetového bankovnictví a v nastavení najděte sekci API. Vytvořte nový token a zadejte ho níže.<br><br>\
	<input type="password" placeholder="Token" name="fioToken"><br><br>\
	<input type="hidden" name="obj" value="fioApi">\
	<input type="hidden" name="func" value="submit">\
	<input type="submit" value="Nastavit">\
</form>\
<form id="air" onsubmit="google.script.run.finBridge(this);google.script.host.close();">\
	Je potřeba úvest přihlašovací údaje do internetového bankovnictví.<br><br>\
	<input type="text" placeholder="Jméno" name="airUser"><br><br>\
	<input type="password" placeholder="Heslo" name="airPass"><br><br>\
	Číslo účtu, který chcete sledovat, ponechte prázdný pro výchozí účet.<br><br>\
	<input type="text" placeholder="Číslo účtu" name="airAccount"><br><br>\
	<input type="hidden" name="obj" value="airApi">\
	<input type="hidden" name="func" value="submit">\
	<input type="submit" value="Nastavit"><br><br>\
	Pro diakritiku zvolte kódování UTF8 v bankovnictví, nastavení, aplikace, historie plateb.\
</form>\
<form>\
	Zvolte banku, kterou chcete používat pro tuto tabulku.<br><br>\
	<a href="#fio" class="button">Fio banka</a> <a href="#air" class="button">Air Bank</a><br><br><br>\
	Můžete nastavit obě banky zároveň.<br><br>\
	Pro vypnutí účtu nastavte prázdná pole.<br><br>\
	Po nastavení bude tabulka každé ráno automaticky aktualizována.<br><br>\
	<a href="https://github.com/Pravdomil/finance-v-tabulce" target="_blank">Bližší informace</a>.\
</form>\
';
		var htmlOutput = HtmlService.createHtmlOutput(html).setSandboxMode(HtmlService.SandboxMode.IFRAME).setWidth(250).setHeight(400);
		
		SpreadsheetApp.getUi().showModalDialog(htmlOutput, ' ');
	}
}


var airApi = new function() {
	
	this.config = JSON.parse(fin.config.getProperty("air"));
	
	this.submit = function(args) {
		this.config = {
			"user": args.airUser,
			"pass": args.airPass,
			"account": args.airAccount,
		}
		fin.config.setProperty('air', JSON.stringify(this.config));
		fin.config.setProperty('airFetchOlder', 1);
	}
	
	this.show = function() {
		
		var older = fin.config.getProperty("airFetchOlder") ? 1 : 0;
		if(older) fin.config.setProperty("airFetchOlder", 0);
		
		var html = '\
<style>\
*{padding: 0;margin: 0;border: 0;position: relative;box-sizing: border-box;vertical-align: bottom;color: inherit;font: inherit;text-decoration: inherit;letter-spacing: inherit;word-spacing: inherit;text-transform: inherit;}\
input,button,textarea,select,.button{display: inline-block;padding: 0.5rem;height: 2rem;border: 1px solid;-webkit-border-radius: .25rem;border-radius: .25rem;background-clip: padding-box;background-color: #FFF}input[type="submit"]{cursor: pointer}.button{text-align: center;font-weight:normal;}\
html{ font-family: sans-serif; font-size: 17px; }\
body { font-size: 14px; line-height: 1rem; }\
b, a { font-weight: bold; }\
</style>\
<b>Finance v tabulce</b><br><br>\
<form id="air" onsubmit="google.script.run.finBridge(this);google.script.host.close();">\
	Je potřeba nainstalovat rozšíření <a href="https://chrome.google.com/webstore/detail/imacros-for-chrome/cplklnmnlbnpmjogncfgfijoopmnlemp">iMacro</a>.<br><br>\
	<a href="javascript:run()">Přihlásit se a aktualizovat</a><br><br>\
</form>\
';
		
		var htmlOutput = HtmlService.createHtmlOutput(html).setSandboxMode(HtmlService.SandboxMode.IFRAME).setWidth(250).setHeight(400);
		
		SpreadsheetApp.getUi().showModalDialog(htmlOutput, ' ');
	}
	
    this.getLatestTransaction = function() {
		
		if (!this.config || !this.config.user || !this.config.pass) return;
		
		this.show();
    }
	
	this.csvSubmit = function(args) {
		
		//convert csv to json
		
		//this.postJson(json);
	}
	
	this.postJson = function(json) {
		
        if (!json) return;
		
		var ids = fin.getIds();
		var out = [];
		
		for (var i = 0; i < json.length; i++) {
        	
			if( ids.indexOf( json[i]["ID pohybu"] ) !== -1) continue;
			
			out.push( json[i] );
        }
		
		fin.insert(out);
	}
}


var fioApi = new function() {
    
    this.token = fin.config.getProperty("fioToken");
	
    this.columns = {
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
        'column7': 'Účel', // Uživatelská identifikace
        'column25': 'Poznámka', // Komentář
        'column10': 'Název protiúčtu',
        'column12': 'Název banky',
        'column18': 'Upřesnění',
        'column9': 'Provedl',
        'column26': 'BIC',
        'column17': 'ID pokynu',
        'column22': 'ID pohybu',
    }
	
	this.submit = function(args) {
		this.token = args.fioToken;
		fin.config.setProperty('fioToken', this.token);
	}
    
    this.api = function(arg) {
        
		if (!this.token) return;
        
		var url = "https://www.fio.cz/ib_api/rest/last/" + this.token + "/" + arg + ".json";
        var response = UrlFetchApp.fetch(url, {muteHttpExceptions: true});
		
		if(response.getResponseCode() != 200) {
			throw "FioApi: Bad token? Or too fast?";
		}
		
        return JSON.parse(response.getContentText()).accountStatement;
    }
    
    this.getLatestTransaction = function() {
        
        var json = this.api("transactions");
        
        if (!json || !json.transactionList) return;
        
        var list = json.transactionList.transaction;
        
        var trans = [];
        
        for (var i = 0; i < list.length; i++) {
            
            var obj = list[i];
            
            trans[i] = {};
            
            for (var key in this.columns) {
                
                var val = obj[key];
                var column = this.columns[key];
                
                if(!val) val = "";
                else if(column == "Datum") val = val.value.replace(/\+[0-9]+/, "");
                else val = val.value;
				
				if(column == "Kód banky" && val) {
					trans[i]["Protiúčet"] = trans[i]["Protiúčet"] + "/" + val;
					continue;
				}
                
                trans[i][column] = val;
            }
        }
        
        return trans;
    }
}


finRules.load();


function fin_query(arg) {
    
    return arg.replace(/FIN_[A-ž_]+/g, function(match, contents, offset, s)
        {
            match = match.replace(/FIN_/, "");
            match = match.replace(/_/, " ");
            
            return String.fromCharCode(97 + fin.columnIndex(match) - 1).toUpperCase();
        }
    );
}

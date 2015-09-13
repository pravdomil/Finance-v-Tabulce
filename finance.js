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
        .addItem('Nastavení', 'finConfig')
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
		
		if(row["Komentář"] !== undefined && row["Komentář"].trim() === "")
		{
			if(row["Zpráva pro příjemce"]) obj["Komentář"] = row["Zpráva pro příjemce"];
			else if(row["Uživatelská identifikace"]) obj["Komentář"] = row["Uživatelská identifikace"];
		}
        
        if(row["Skupina"] == "" && row["Věc"] == "") {
            
            var rule = finRules.get(row);
            
            if(rule) {
                obj["Skupina"] = rule.group;
                obj["Věc"] = rule.item;
                
                if(rule.character) obj["Charakter"] = rule.character;
				if(obj["Komentář"] === "") obj["Komentář"] = rule.comment;
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
        this.config = PropertiesService.getDocumentProperties();
    
        if(this.config.getProperty("triggerSet")) return;
    
        ScriptApp.newTrigger('dailyTrigger').timeBased().atHour(6).everyDays(1).create();
    
        this.config.setProperty("triggerSet", true);
    }
    catch (e) {}
}


var fin = new function() {
    
    this.emptySheet = function() {
        
        var template = SpreadsheetApp.openById('1pj6zDR6Bh2Zg5DTMQFfa69yiS4np0WqUceuKsEL7jSA');
		return template.getSheetByName("db").copyTo(this.ss).setName("db").activate();
    }
	
    this.balanceSheet = function() {
        
        var template = SpreadsheetApp.openById('1pj6zDR6Bh2Zg5DTMQFfa69yiS4np0WqUceuKsEL7jSA');
		return template.getSheetByName("zůstatek").copyTo(this.ss).setName("zůstatek");
    }
    
    this.refresh = function() {
        
        //var latest = fioApi.getLatestTransaction();
        
        //this.insert(latest);
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
    
    this.ss = SpreadsheetApp.getActive();
    if(this.ss)
	{
		this.sheet = this.ss.getSheetByName("db") || this.emptySheet();
		
		this.balance = this.ss.getSheetByName("zůstatek") || this.balanceSheet();
    	
    	this.columns = this.sheet.getRange("1:1").getValues()[0];
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

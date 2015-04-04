var fioColumns = new function() {
    
    this.range = "A:Y";
    
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
    
    this.arr.push("Měsíc");
    this.arr.push("Přijato");
    this.arr.push("Odesláno");
    this.arr.push("Skupina");
    this.arr.push("Věc");
    this.arr.push("Rok");
}


var fioRules = new function() {
    
    this.loadRulesFromFile = function() {
        
        this.rules = [];
        
        var file = HtmlService.createHtmlOutputFromFile('rules').getContent().split("\n");
        
        for(var i = 0; i < file.length; i++) {
    
            var line = file[i];
        
            if(!line.trim()) continue;
        
            var group;
            var item;
        
            if(/^\s+/.test(line))
            {
                this.rules.push({
                    group : group,
                    item : item,
                    cond : this.parseCondition(line)
                })
            }
            else
            {
                line = line.split(">");
            
                group = line[0] ? line[0].trim() : "";
                item = line[1] ? line[1].trim() : "";
            }
        }
    }
    
    this.parseCondition = function(cond) {
        
        var arr = [];
        
        cond = cond.split("&&");
        
        for(var i = 0; i < cond.length; i++) {
            
            var equal = cond[i].split("==");
            
            if(equal.length == 2) {
                
                arr.push({
                    column : equal[0].trim(),
                    value : equal[1].trim(),
                    mode : "equal",
                });
            }
            
            var match = cond[i].split("~");
            
            if(match.length == 2) {
                
                arr.push({
                    column : match[0].trim(),
                    value : match[1].trim(),
                    mode : "match",
                });
            }
        }
        
        return arr;
    }
    
    this.get = function(row) {
        
        for(var i = 0; i < this.rules.length; i++) {
            
            var rule = this.rules[i];
            var passed = false;
            
            for(var c = 0; c < rule.cond.length; c++) {
                
                var cond = rule.cond[c];
                
                if(cond.mode == "equal") passed = (row[cond.column] == cond.value);
                else if(cond.mode == "match") {
                    
                    var regex = new RegExp( this.escapeRegExp(cond.value), "i");
                    passed = regex.test(row[cond.column]);
                }
                
                if(!passed) break;
            }
            
            if(passed) return rule;
        }
    }
    
    this.escapeRegExp = function(s) {
        return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
    }
    
    this.loadRulesFromFile();
}


var fioApi = new function() {
    
    this.config = PropertiesService.getUserProperties();
    
    this.promptToken = function() {
        
        this.token = Browser.inputBox('Zadejte token');
        if(this.token == "cancel") this.token = "";
        
        this.config.setProperty('token', this.token);
        
        return this.token;
    }
    
    this.api = function(arg) {
        
        this.token = this.config.getProperty("token");
        
        if (!this.token && !this.promptToken()) throw "Token není nastaven.";
        
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
            
            trans[i] = [];
            
            for (var key in fioColumns.obj) {
                
                var val = obj[key];
                
                if(!val) val = "";
                else if(val.name == "Datum") val = val.value.replace(/\+[0-9]+/, "");
                else val = val.value;
                
                trans[i].push(val);
            }
        }
        
        return trans.reverse();
    }
}


var fioCategory = new function() {
    
    this.resolve = function(sheet) {
        
        this.sheet = sheet;
        
        var data = this.sheet.getRange(fioColumns.range).getValues();
        
        for(var i = 1; i < data.length; i++) {
            data[i] = this.categorize(data[i]);
        }
        
        sheet.getRange(fioColumns.range).setValues(data);
    }
    
    this.categorize = function(rowArr) {
        
        var row = this.rowToObj(rowArr);
        
        row["Měsíc"] = row["Datum"] ? row["Datum"].getYear() + "." + (row["Datum"].getMonth() + 1) : "";
        
        row["Přijato"] = row["Objem"] < 0 ? 0 : row["Objem"];
        
        row["Odesláno"] = row["Objem"] < 0 ? (row["Objem"] * -1) : 0;
        
        row["Rok"] = row["Datum"] ? row["Datum"].getYear() : "";
  
        if(row["Skupina"] == "" && row["Věc"] == "") {
            
            var rule = fioRules.get(row);
            
            if(rule) {
                row["Skupina"] = rule.group;
                row["Věc"] = rule.item;
            }
        }
  
        return this.rowToArr(row);
    }
    
    this.rowToObj = function(arr) {
        
        var obj = {};
        
        for(var i = 0; i < arr.length; i++) {
            
            var type = fioColumns.arr[i];
            
            obj[type] = this.formatCell(arr[i], type, true);
        }
        
        return obj;
    }
    
    this.rowToArr = function(obj) {
        
        var arr = [];
        
        for(var key in obj) arr.push( this.formatCell(obj[key], key) );
        
        return arr;
    }
    
    this.formatCell = function(value, type, forJS) {
        switch(type) {
            case "Objem":
            case "ID pohybu":
            case "Výdaj":
            case "Příjem":
            case "Přijato":
            case "Odesláno":
                return forJS ? this.jsNumber(value) : this.docsNumber(value);
            case "Datum":
                return value;
            default:
                return String(value);
        }
    }

    this.docsNumber = function(num) {
        return String(Number(String(num).replace(",", "."))).replace(".", ",");
    }

    this.jsNumber = function(num) {
        return Number(String(num).replace(",", "."));
    }
}


var fioTrigger = new function() {
    
    this.config = PropertiesService.getUserProperties();
    
    if(this.config.getProperty("triggerSet")) return;
    
    ScriptApp.newTrigger('update').timeBased().atHour(5).everyDays(1).create();
    
    this.config.setProperty("triggerSet", true)
}


var fio = new function() {
    
    this.emptySheet = function() {
        
        this.sheet = this.ss.insertSheet('db', 0);
        
        this.sheet.getRange(1, 1, 1, fioColumns.arr.length).setValues([fioColumns.arr]);
        
        this.sheet.deleteRows(2, this.sheet.getMaxRows() - 1);
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
        
        this.sheet.insertRowsAfter(1, data.length);
        this.sheet.getRange(2, 1, data.length, data[0].length).setValues(data);
    }
    
    this.ss = SpreadsheetApp.getActive();
    if(!this.ss) return;
    
    this.sheet = this.ss.getSheetByName("db");
    if(!this.sheet) this.emptySheet();
}

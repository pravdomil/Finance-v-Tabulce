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
    this.arr.push("Pohyb");
    this.arr.push("Částka");
    this.arr.push("Skupina");
    this.arr.push("Věc");
    this.arr.push("Rok");
}


var fioRules = new function() {
    
    this.load = function() {
        
        this.sheet = fio.ss.getSheetByName("rules");
        if(!this.sheet) this.sheet = fio.ss.insertSheet('rules', 0);
        
        this.parse(this.sheet.getRange("A:F").getValues());
    }
    
    this.parse = function(array) {
        
        this.rules = [];
        
        for(var i = 1; i < array.length; i++) {
    
            var group = array[i][0];
            var item = array[i][1];
            
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
    
    this.config = PropertiesService.getUserProperties();
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
    
    this.setLatestTransaction = function(arg) {
        
        if (!this.token) return;
        
        UrlFetchApp.fetch("https://www.fio.cz/ib_api/rest/set-last-id/" + this.token + "/" + arg + "/");
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
        
        var data = this.sheet.getRange(fioColumns.range).getValues();
        
        for(var i = 1; i < data.length; i++) {
            data[i] = this.categorize(data[i]);
        }
        
        sheet.getRange(fioColumns.range).setValues(data);
    }
    
    this.categorize = function(rowArr) {
        
        var row = this.rowToObj(rowArr);
        
        row["Měsíc"] = row["Datum"] ? row["Datum"].getYear() + "." + (row["Datum"].getMonth() + 1) : "";
        
        row["Pohyb"] = row["Objem"] < 0 ? "Výdaj" : "Příjem";
        
        row["Částka"] = Math.abs(row["Objem"]);
        
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
    
    this.formatCell = function(value, column, forJS) {
        switch(column) {
            case "Objem":
            case "ID pohybu":
            case "Výdaj":
            case "Částka":
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
    try
    {
        this.config = PropertiesService.getUserProperties();
    
        if(this.config.getProperty("triggerSet")) return;
    
        ScriptApp.newTrigger('update').timeBased().atHour(5).everyDays(1).create();
    
        this.config.setProperty("triggerSet", true);
    }
    catch (e) {}
}


var fio = new function() {
    
    this.emptySheet = function() {
        
        this.sheet = this.ss.insertSheet('db', 0);
        
        this.sheet.getRange(1, 1, 1, fioColumns.arr.length).setValues([fioColumns.arr]);
        
        this.sheet.deleteRows(2, this.sheet.getMaxRows() - 1);
    }
    
    this.update = function() {
        
        var last_id = this.sheet.getRange("S2:S100").getValues()[0];
        
        for(var i = 0; i < last_id.length; i++)
        {
            if(!last_id[i]) continue;
            
            fioApi.setLatestTransaction(String(last_id[i]));
            break;
        }
        
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
    
    this.ss = SpreadsheetApp.getActive();
    if(!this.ss) throw "Žádný spreadsheet.";
    
    this.sheet = this.ss.getSheetByName("db");
    if(!this.sheet) this.emptySheet();
    
    this.columns = this.sheet.getRange("1:1").getValues()[0];
}

fioRules.load();

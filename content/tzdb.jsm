"use strict";

var EXPORTED_SYMBOLS = ["tzdb"];

const Cc = Components.classes;
const Ci = Components.interfaces;

/* * *
 * Inspired by:
 * https://developer.mozilla.org/en-US/Add-ons/Thunderbird/HowTos/Common_Thunderbird_Extension_Techniques/Use_SQLite
 */

var tzdb = {

    conn: null,
    defaultAccount: null,
    accountColumns: ["accountname","LastSyncTime"],


    onLoad: function() {
        // initialization code
        this.initialized = true;
        this.dbInit();
        this.defaultAccount = this.getDefaultAccount();
    },


    dbInit: function () {
        let dirService = Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIProperties);
        let dbFile = dirService.get("ProfD", Ci.nsIFile);
        dbFile.append("ZPush");
        dbFile.append("db.sqlite");

        let dbService = Cc["@mozilla.org/storage/service;1"].getService(Ci.mozIStorageService);
        if (!dbFile.exists()) {
            this.conn = dbService.openDatabase(dbFile);

            //Create accounts table with accountColumns
            let sql = ""; for (let i=0; i<this.accountColumns.length; i++) sql = sql + ", " + this.accountColumns[i] + " TEXT";
            this.conn.executeSimpleSQL("CREATE TABLE accounts(account INTEGER PRIMARY KEY AUTOINCREMENT " + sql + ");");
            this.conn.executeSimpleSQL("INSERT INTO accounts(accountname) VALUES('Default');");

            //Create settings table
            this.conn.executeSimpleSQL("CREATE TABLE settings(id INTEGER PRIMARY KEY AUTOINCREMENT, account INTEGER, name TEXT, value TEXT);");
        } else {
            this.conn = dbService.openDatabase(dbFile);
        }
    },


    getAccounts: function () {
        let accounts = {};
        let statement = this.conn.createStatement("SELECT account, accountname FROM accounts;");
        while (statement.executeStep()) {
            accounts[statement.row.account] = statement.row.accountname;
        }
        return accounts;
    },


    addAccount: function (accountname) {
        this.conn.executeSimpleSQL("INSERT INTO accounts(accountname) VALUES('"+accountname+"');");
        let statement = this.conn.createStatement("SELECT seq FROM sqlite_sequence where name='accounts';");
        if (statement.executeStep()) {
            return statement.row.seq;
        } else {
            return null;
        }
    },


    getIdOfSetting: function (account, name) {
        let statement = this.conn.createStatement("SELECT id FROM settings WHERE account='" + account + "' AND name='" + name +"';");
        if (statement.executeStep()) {
            return statement.row.id;
        } else {
            return null
        }
    },


    setAccountSetting: function (account , name, value) {
        if (this.accountColumns.indexOf(name) != -1) {
            //this field is part of the accounts table with its own column
            this.conn.executeSimpleSQL("UPDATE accounts SET "+name+"='"+value+"' WHERE account='" + account + "';");
        } else {
            //this field is part of the generic settings table
            //first get id of setting
            let id = this.getIdOfSetting(account, name);
            if (id) { //UPDATE
                this.conn.executeSimpleSQL("UPDATE settings SET value='"+value+"' WHERE account='" + account + "' AND id=" + id + ";");
            } else { //INSERT
                this.conn.executeSimpleSQL("INSERT INTO settings(account,name,value) VALUES('"+account+"','"+name+"','" +value+ "');");
            }
        }
    },


    getAccountSetting: function (account, name) {
        let col;
        let statement;
        if (this.accountColumns.indexOf(name) != -1) {
            //this field is part of the accounts table with its own column
            statement = this.conn.createStatement("SELECT "+name+" FROM accounts WHERE account='" + account + "';");
            col = name;
        } else {
            //this field is part of the generic settings table
            statement = this.conn.createStatement("SELECT value FROM settings WHERE account='" + account + "' AND name='" + name + "';");
            col = "value";
        }

        if (statement.executeStep()) {
            return statement.row[col];
        } else {
            return "";
        }
    }

};

tzdb.onLoad();

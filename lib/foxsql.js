function foxdb() {

	var that = this;

	this.oADO = require('node-adodb');

	this.query = function(queryStr, dbDir, callback) {

		var DB_DIR;
		var deasync = require('deasync');

		if(arguments.length === 2) {

			DB_DIR = "G:\\coolwind\\";
		}else{

			DB_DIR = dbDir;
		}

		var retSet = undefined;
		var connection;
		var conStr = "Provider=VFPOLEDB.1;Data Source=" + DB_DIR + ";";
		//var conStr = "DSN=Visual FoxPro Database;Data Source=" + DB_DIR + ";";

		connection = that.oADO.open(conStr);

		connection.query(queryStr).on('done', function (data){
			retSet = data["records"];
			callback(null, retSet);
		}).on('fail', function (data){
			callback("FAILURE: " + JSON.stringify(data, null, '  '), null);
		});

	}

	return this;

}

exports.foxdb = foxdb;

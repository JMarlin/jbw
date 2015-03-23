var foxsql = require('../../lib/foxsql');

//This currently has no provision for access limitation or associating menu items with commands.
function display(res, callback) {

	var menuEntries = {};
	var itemKeys;
	var sql;
	var menuDefs = { "DataEntry" : "Data Entry",
	                 "Reports" : "Reports",
					 				 "ADP" : "ADP",
					 				 "Maintenanc" : "Maintenance" };

	var ratchetCounter;
	var menuKeys = Object.keys(menuDefs);

	var after = function(count, callback) {

	    return function() {

			};
	}

	var writeMenu = function() {

			res.write("<div class='banner'><img src='res/images/banner.png' /><ul class='jbw_menubar'>");

		  Object.keys(menuDefs).forEach(function(headKey) {

			    res.write("<li>" + menuDefs[headKey] + "<ul>");

				  menuEntries[headKey].forEach(function(item){

					    res.write("<li>" + item["prompt"] + "</li>");
				  });

					res.write("</ul></li>");
		  });

		  res.write("</ul></div>");
			callback();
	}

	sql = new foxsql.foxdb();
	ratchetCounter = 0;
	menuKeys.forEach(function(menuKey) {

		sql.query("SELECT * FROM screenButtons.DBF WHERE Levelname = '" + menuKey + "';", "C:\\Users\\jmarlin\\Documents\\Visual FoxPro Projects\\cwv\\jobbook\\metadata\\", function(e, qres){

				if(e) {

					menuEntries[menuKey] = [];
					console.log(e);
				} else {

					menuEntries[menuKey] = qres;
				}

				ratchetCounter++;

				if(ratchetCounter === menuKeys.length)
				    writeMenu();
		});
	});
}

exports.display = display;

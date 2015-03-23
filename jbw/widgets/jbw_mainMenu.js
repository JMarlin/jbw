var jbw_base = require('./jbw_base.js'),
    foxsql   = require('../../lib/foxsql');


function jbw_menuHeading(name, title, session) {

    var base = new jbw_base.jbw_widget(name, session);
    base.type = "menuHeading";
    base.title = title;
    return base;
}


function jbw_menuEntry(name, title, action, session) {

    var base = new jbw_base.jbw_widget(name, session);
    base.type = "menuEntry";
    base.title = title;
    base.action = action;
    return base;
}


//This currently has no provision for access limitation or associating menu items with commands.
function getMenuData(session, handBack) {

  var returnChildren = [];
  var menuEntries = {};
  var tempHeading;
  var itemKeys;
  var sql;
  var menuDefs = { "DataEntry" : "Data Entry",
                   "Reports" : "Reports",
                   "ADP" : "ADP",
                   "Maintenanc" : "Maintenance" };

  var ratchetCounter;
  var menuKeys = Object.keys(menuDefs);

  var after = function(count, handBack) {

      return function() {

      };
  }

  var writeMenu = function() {

      Object.keys(menuDefs).forEach(function(headKey) {

          tempHeading = new jbw_menuHeading('', menuDefs[headKey], session);

          menuEntries[headKey].forEach(function(item){

              tempHeading.children.push(new jbw_menuEntry('', item["prompt"], {}, session));
          });

          returnChildren.push(tempHeading);
      });

      handBack(returnChildren);
  };

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


function jbw_menuBar(name, session) {

    var base = new jbw_base.jbw_widget(name, session);
    base.type = "menuBar";
    return base;
}


exports.spawn = function(session, handBack) {

    var retMenu = new jbw_menuBar('mainMenu', session);

    getMenuData(session, function(newChildren){

        retMenu.children = newChildren;
        handBack(retMenu);
    });
};

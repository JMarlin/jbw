var jbw_base = require('./jbw_base.js'),
    pg   = require('pg');


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
  var menuDefs = { "DataEntry"   : "Data Entry",
                   "Reports"     : "Reports",
                   "ADP"         : "ADP",
                   "Maintenance" : "Maintenance" };

  var ratchetCounter;
  var menuKeys = Object.keys(menuDefs);

  var after = function(count, handBack) {

      return function() {

      };
  };

  var writeMenu = function() {

      Object.keys(menuDefs).forEach(function(headKey) {

          tempHeading = new jbw_menuHeading('', menuDefs[headKey], session);

          menuEntries[headKey].forEach(function(item){

              tempHeading.children.push(new jbw_menuEntry('', item.prompt, {}, session));
          });

          returnChildren.push(tempHeading);
      });

      handBack(returnChildren);
  };

  ratchetCounter = 0;

  (function processNextMenu() {

      var menuKey = menuKeys[ratchetCounter];
      console.log('Getting items in menu "' + menuKey + '"');

      pg.connect("postgres://jbadmin:pg1pg2!+c0013R@192.168.21.106/jbdev", function(err, client, done){

          menuEntries[menuKey] = [];

          if(err) {

            console.log(e);
          } else {

              var query = client.query("SELECT * FROM screenbuttons WHERE levelname = '" + menuKey + "';");

              query.on('row', function(row) {

                 console.log('Got a row');
                 menuEntries[menuKey].push(row);
              });

              query.on('error', function(err, client) {

                  console.log(err);
              });

              query.on('end', function() {

                  ratchetCounter++;
                  client.end();

                  if(ratchetCounter === menuKeys.length)
                      writeMenu();
                  else
                      processNextMenu();
              });
          }
      });
  })();
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

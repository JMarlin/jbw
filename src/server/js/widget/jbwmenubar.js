function JBWMenuBar(session, done) {

    //This currently has no provision for access limitation or associating menu items with commands.
    function getMenuData(session, handBack) {

      var returnChildren = [];
      var menuEntries = {};
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

              JBWMenuHeading(menuDefs[headKey], session, function(tempHeading){ 

                  console.log('Created heading "' + tempHeading + '"');
                  menuEntries[headKey].forEach(function(item){
  
                      JBWMenuEntry(item.prompt, {}, session, function(tempEntry) {
		      
		          tempHeading.children.push(tempEntry);
		      });
                  });
		  
		  //Note that this only works because the above 'async' widget
	          //constructors are note *actually* asynchronus
                  returnChildren.push(tempHeading);
	      });
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


    JBWWidget(session, function(base) {
    
        base.type = "menuBar";
	
        getMenuData(session, function(newChildren){

            base.children = newChildren;
            done(base);
        });
    });
}	

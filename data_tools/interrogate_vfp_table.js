var foxsql      = require('../lib/foxsql'),
    fox         = new foxsql.foxdb(),
    typeMap     = {
        
    };



function getVFPTableFormat(tableName, handBack, dbDir) {

    if(!dbDir)
        dbDir = 'C:\\Users\\jmarlin\\Documents\\Visual FoxPro Projects\\cwv\\jobbook\\';

    //Select a row from the vfp database, use object.keys on the result to extract the names of the columns
    fox.query('SELECT * FROM ' + tableName + ' WHERE RECNO() = 1;', dbDir, function(e, d) {

        var columnNames = [],
            queryString = '';

        if(e) {

            console.log(e);
            return;
        }

        if(d.length === 0) {

            console.log('No data returned for table ' + tableName + '.');
            return;
        }

        //Create a selection of the following format to get the types for each column:
        //    SELECT TOP 1 TYPE("<table>.<field1>") as <field1>, [...]TYPE("<table>.<fieldn>") as <fieldn> FROM <table> ORDER BY <field1>
        columnNames = Object.keys(d[0]);
        queryString = 'SELECT TOP 1 ';

        columnNames.forEach(function(col, i) {

            if(i > 0)
                queryString += ', ';

            queryString += 'TYPE("' + tableName + '.' + col + '") as ' + col;
        });

        queryString += ' FROM ' + tableName + ' ORDER BY ' + columnNames[0] + ';';

        fox.query(queryString, dbDir, function(e, d) {

            if(e) {

                console.log(e);
                return;
            }

            if(d.length === 0) {

                console.log('Query \'' + queryString + '\' returned no results.');
                return;
            }

            //Print the result
            handBack(d[0]);
        });
    });
}


getVFPTableFormat('job', function(d) {

    console.log(d);
});

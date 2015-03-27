var foxsql      = require('../lib/foxsql'),
    pg          = require('pg'),
    sql         = new foxsql.foxdb(),
    ratchet     = 0,
    preratchet  = 0,
    results     = [];

pg.defaults.poolSize = 25;

/*
pg.connect("postgres://jbadmin:pg1pg2!+c0013R@192.168.21.106/jbdev", function(err, client, done){

    var query = client.query("SELECT * FROM screenbuttons;");

    query.on('row', function(row) {

        results.push(row);
    });

    query.on('end', function() {

        console.log(results);
        client.end();
    });
});
*/

/*
pg.connect("postgres://jbadmin:pg1pg2!+c0013R@192.168.21.106/jbdev", function(err, client, done){

    var query = client.query("INSERT INTO screenbuttons (prompt, action, role, levelname, resname, active) VALUES ($1, $2, $3, $4, $5, $6);", ['testprompt', 'null', 'all', 'DataEntry', 'stuff.png', true]);

    query.on('end', function() {

        console.log('Done, son.');
        client.end();
    });
});
*/


sql.query("SELECT * FROM screenButtons.DBF;", "C:\\Users\\jmarlin\\Documents\\Visual FoxPro Projects\\cwv\\jobbook\\metadata\\", function(e, qres){

    (function nextInsert() {

        var foxRow = qres[ratchet];

        console.log('Initiating transfer #' + (++preratchet));

        pg.connect("postgres://jbadmin:pg1pg2!+c0013R@192.168.21.106/jbdev", function(err, client, done){

            var query = client.query(
                "INSERT INTO screenbuttons (prompt, action, role, levelname, resname, active) VALUES ($1, $2, $3, $4, $5, $6);",
                [
                    foxRow.prompt.trim(),
                    '',
                    '',
                    foxRow.levelname.trim() === 'Maintenanc' ? 'Maintenance' : foxRow.levelname.trim(),
                    foxRow.resname.trim(),
                    foxRow.active
                ]
            );

            query.on('error', function(err, client) {

                console.log(err);
            });

            query.on('end', function() {

                ratchet++;
                console.log('Row #' + ratchet + ' transferred.');
                client.end();

                if(ratchet === qres.length)
                    doneFunc();
                else
                    nextInsert();
            });

            if(err) {

                console.log(err);
            }

        });
    })();
});


function doneFunc() {

    console.log('All entries transferred.');
}

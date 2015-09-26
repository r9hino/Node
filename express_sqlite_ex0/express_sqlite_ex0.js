var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data');

db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS counts (key TEXT, value INTEGER)");
    db.run("INSERT INTO counts (key, value) VALUES (?, ?)", "counter", 0);
    db.run("INSERT INTO counts (key, value) VALUES (?, ?)", "counter", 1);
    db.run("INSERT INTO counts (key, value) VALUES (?, ?)", "counter", 2);
});



var express = require('express');
var restapi = express();

restapi.get('/data', function(req, res){
    db.all("SELECT * FROM counts", function(err, rows){
        res.send(rows);
    });
});

restapi.post('/data', function(req, res){
    db.run("UPDATE counts SET value = value + 1 WHERE key = ?", "counter", function(err, row){
        if (err){
            console.err(err);
            res.status(500);
        }
        else {
            res.status(202);
        }
        res.end();
    });
});


restapi.listen(7777);

console.log("Submit GET or POST to http://localhost:7777/data");
// Web page server with DB for bookmarks handling. Rendered by ejs.
// Ref:
//  https://cozy.io/en/hack/getting-started/first-app.html

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('bookmarks.db');


// We add configure directive to tell express to use Jade to render templates.
app.set('views', __dirname + '/public');
app.set('view engine', 'ejs');
// Allows express to get data from POST requests.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Database initialization.
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='bookmarks'", function(err, row) {
    if(err) {
        console.log(err);
    }
    else if(row == null) {
        db.run('CREATE TABLE "bookmarks" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "title" VARCHAR(255), url VARCHAR(255))', function(err) {
            if(err) {
                console.log(err);
            }
            else {
                console.log("SQL Table 'bookmarks' initialized.");
            }
        });
    }
    else {
        console.log("SQL Table 'bookmarks' already initialized.");
    }
});

// We render the templates with the data.
app.get('/', function(req, res) {
    db.all('SELECT * FROM bookmarks ORDER BY title', function(err, row) {
        if(err) {
            res.send("An error has occurred -- " + err)
        }
        else {
            res.render('index.ejs', {
                title:"Bookmarks WEB using SQLite as DB handler", 
                bookmarks: row
            }, function(err, html) {
                if(err) console.log(err);
                else    res.send(html);
            });
        }
    });
});

// We define a new route that will handle bookmark creation
app.post('/add', function(req, res) {
    var title = req.body.title;
    var url = req.body.url;
    var sqlRequest = "INSERT INTO 'bookmarks' (title, url) VALUES('" + title + "', '" + url + "')"
    db.run(sqlRequest, function(err) {
        if(err !== null) {
            //res.send(500, "An error has occurred -- " + err);
            res.send("An error has occurred -- " + err)
        }
        else {
            res.redirect('back');
        }
    });
});

// We define another route that will handle bookmark deletion
app.get('/delete/:id', function(req, res) {
    db.run("DELETE FROM bookmarks WHERE id='" + req.params.id + "'", function(err) {
        if(err) {
            res.send("An error has occurred -- " + err)
        }
        else {
            res.redirect('back');
        }
    });
});

// Starts the server.
var server = app.listen(7777, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Server listening to %s:%d", host, port);
});
// Example from: https://openclassrooms.com/en/courses/2504541-ultra-fast-applications-using-node-js/2505653-socket-io-let-s-go-to-real-time

var http = require('http');
var fs = require('fs');

// Loading the index file . html displayed to the client
var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
}).listen(8888);

// Loading socket.io
var io = require('socket.io').listen(server);

// When a client connects, we note it in the console
io.sockets.on('connection', function (socket) {
    console.log('A client is connected!');
    
    socket.on('little_newbie', function(username) {
        socket.username = username;
    });
    // When the server receives a “message” type signal from the client.
    socket.on('message', function (message) {
        console.log(socket.username + ' is speaking to me! They\'re saying: ' + message);
    });
    
    //socket.emit('message', 'You are connected!');
    socket.broadcast.emit('message', 'Another client has just connected!');
});

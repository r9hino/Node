//https://socket.io/get-started/chat/

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 8888;//process.env.PORT || 8888;

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
    //res.sendFile('/var/lib/cloud9/Node/socketio_chat' + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port + '  ' + __dirname);
});
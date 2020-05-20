// https://randomnerdtutorials.com/programming-the-beaglebone-black-with-bonescript/

var http = require('http');
var fs = require('fs');
var b = require('bonescript');

// Bone  | AIN
// ----- | --- 
// P9_39 | A0
// P9_40 | A1
// P9_37 | A2
// P9_38 | A3
// P9_33 | A4
// P9_36 | A5
// P9_35 | A6
var inAnalogA3 = "A3";
var inAnalogA4 = "A4";
var inAnalogA5 = "A5";
var inAnalogA6 = "A6";

// Create a variable called led, which refers to P9_14
var led = "P9_14";
// Initialize the led as an OUTPUT
b.pinMode(led, b.OUTPUT);

// Loading the index file. html displayed to the client
var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
}).listen(8888, () => {console.log('Server just started, listening on port: 8888');});

// Loading socket.io
var io = require('socket.io').listen(server);

// When communication is established
io.on('connection', function (socket) {
    socket.on('changeState', handleChangeState);

    setInterval(function(){
        var valueAnalogA3 = b.analogRead(inAnalogA3);
        var valueAnalogA4 = b.analogRead(inAnalogA4);
        var valueAnalogA5 = b.analogRead(inAnalogA5);
        var valueAnalogA6 = b.analogRead(inAnalogA6);

        socket.emit('analogUpdate', {"valueAnalogA3": (valueAnalogA3*100).toFixed(1) + '%, ' + (1.8*valueAnalogA3).toFixed(3) + 'V',
                                     "valueAnalogA4": (valueAnalogA4*100).toFixed(1) + '%, ' + (1.8*valueAnalogA4).toFixed(3) + 'V',
                                     "valueAnalogA5": (valueAnalogA5*100).toFixed(1) + '%, ' + (1.8*valueAnalogA5).toFixed(3) + 'V',
                                     "valueAnalogA6": (valueAnalogA6*100).toFixed(1) + '%, ' + (1.8*valueAnalogA6).toFixed(3) + 'V'
        });
    }, 500);
});

// Change led state when a button is pressed
function handleChangeState(data) {
    var newData = JSON.parse(data);
    var nowDate = new Date();
    var strDate = nowDate.getFullYear() + "-" + nowDate.getMonth() + "-" + nowDate.getDay() + " " + 
                  nowDate.getHours() + ":" + nowDate.getMinutes() + ":" + nowDate.getSeconds();
    console.log(strDate + "   LED = " + newData.state);
    // turns the LED ON or OFF
    b.digitalWrite(led, newData.state);
}

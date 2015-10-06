// Toggle relay using function relayOn and relayOff, passing as parameter i2c address and relayID.

var async = require('async');
var i2c = require('i2c');

var i2cWire =  null;

// I2C device configuration address and registers.
var i2cAddress = 0x20;
var i2cIODIR0 = 0x6;
var i2cIODIR1 = 0x7;
var i2cGPIO0 = 0x0;
var i2cGPIO1 = 0x1;


var relayID = 1;

function getRelayState(relayID){
    var relayBoardState;
    var relayState;
     
    i2cWire.readBytes(i2cGPIO0, 1, function(err, res){
        if(err) return err;
        
        relayBoardState = res.toJSON(res)[0];
        console.log("Relay board state is: " + relayBoardState);
        relayState = relayBoardState & (1<<(relayID-1));
        console.log("The relay state is: " + relayState);;
    });

    if(relayState === 0) return 0;

    // If not zero, relay must be on.
    return 1;
}

async.series([
    function (cb) {
      i2cWire =  new i2c(i2cAddress, {device: '/dev/i2c-1'}); // point to your i2c address, debug provides REPL interface 
      cb(null);
    },
    function(cb) {
        // Set GPIO0 port from I2C device as outputs.
        i2cWire.writeBytes(i2cIODIR0, [0x0], function(err){
            if(err){
                console.log('Error configuring GPIO0 port as output: ' + err);
                return cb(err);
            }
            console.log('GPIO0 ports set successfully as outputs.');
            cb(null);
        });
    },
    function(cb) {
        // Set GPIO1 port from I2C device as outputs.
        i2cWire.writeBytes(i2cIODIR1, [0x0], function(err){
            if(err){
                console.log('Error configuring GPIO0 port as output: ' + err);
                return cb(err);
            }
            console.log('GPIO1 ports set successfully as outputs.');
            cb(null);
        });
    },
    function(cb) {
        getRelayState(relayID);
    }
  ], 
  function(err) {
    if(err) throw err;
});









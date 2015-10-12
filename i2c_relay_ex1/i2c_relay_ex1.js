// Toggle relay using function relayOn and relayOff, passing as parameter i2c address and relayID.

var async = require('async');
var i2c = require('i2c');

var i2cWire =  null;

// I2C device configuration address and registers.
var i2cAddress = 0x20;
var i2cGPIO0 = 0x0;
var i2cGPIO1 = 0x1;
var i2cIODIR0 = 0x6;
var i2cIODIR1 = 0x7;


function getRelayState(relayID, callback){
    var relayBoardState;    // Retrieve all on and off relay from the board.
    var relayState = 0;     // It will store the state of the relayID.
    
    // Select corresponding bit based on relayID.
    // If relayID = 3 -> relayMask = 0b0100
    var relayMask = 1<<(relayID-1);
    console.log("Relay mask: " + relayMask.toString(2));
 
    i2cWire.readBytes(i2cGPIO0, 1, function(err, res){
        if(err) return err;
        
        // Get relay board state
        relayBoardState = res.readUInt8(0);
        relayState = relayBoardState & relayMask;
        
        // Set relayState to 1 when relayID is on.
        if(relayState !== 0) relayState = 1;

        console.log("The relay state is: " + relayState);
        callback(relayState);
    });
}

function getRelayBoardState(callback){
    i2cWire.readBytes(i2cGPIO0, 1, function(err, res){
        var relayBoardState;    // Retrieve all on and off relay from the board.
        if(err) return err;
        
        // Get relay board state
        relayBoardState = res.readUInt8(0);
        console.log("Relay board state is: " + relayBoardState.toString(2));
        callback(relayBoardState);
    });
}

// Change specific relay state on/off.
function changeRelayState(relayID, state){
    // Convert relayID number to the corresponding bit mask.
    // If relayID = 3 -> relayMask = 0b0100
    var relayMask = 1<<(relayID-1);
        
    getRelayBoardState(function(relayBoardState){
        if(state === 'on'){
            relayBoardState = relayBoardState | relayMask;
        }
        // If state is 'off'.
        else{
            // Only if relay is on, turn it off.
            if(relayBoardState & relayMask)
                relayBoardState = relayBoardState ^ relayMask;
        }
        
        i2cWire.writeBytes(i2cGPIO0, [relayBoardState], function(err){
            if(err)  return err;
            console.log("New relay board state is: " + relayBoardState.toString(2));
        });
    });
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
        });
        
        // Set GPIO1 port from I2C device as outputs.
        i2cWire.writeBytes(i2cIODIR1, [0x0], function(err){
            if(err){
                console.log('Error configuring GPIO1 port as output: ' + err);
                return cb(err);
            }
            console.log('GPIO1 ports set successfully as outputs.');
        });
        cb(null);
    },
    function(cb) {
        getRelayBoardState(function(relayBoardState){
            console.log("getRelayBoardState return: " + relayBoardState);
            cb(null);
        });
    },
    function(cb) {
        getRelayState(1, function(relayState){
            console.log("getRelayState return: " + relayState);
            cb(null);
        });
    },
    function(cb) {
        changeRelayState(1,'on');
        cb(null);
    },
    function(cb) {
        changeRelayState(2,'on');
        cb(null);
    }
  ], 
  function(err) {
    if(err) throw err;
});









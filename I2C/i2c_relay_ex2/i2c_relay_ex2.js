// Toggle relay using async module with queue function for 1 concurrent task.
// In order to change a relay state, system wait the relay board state to change relay state.

var async = require('async');
var i2c = require('i2c');

var i2cWire =  null;

// I2C device configuration address and registers.
var i2cAddress = 0x20;
var i2cGPIO0 = 0x0;
var i2cGPIO1 = 0x1;
var i2cIODIR0 = 0x6;
var i2cIODIR1 = 0x7;


var relayArrayOnState = [{relayID: 1, state: 'on'},
                         {relayID: 2, state: 'on'},
                         {relayID: 3, state: 'on'},
                         {relayID: 4, state: 'on'},
                         {relayID: 5, state: 'on'},
                         {relayID: 6, state: 'on'},
                         {relayID: 7, state: 'on'},
                         {relayID: 8, state: 'on'}];
var relayArrayOffState = [{relayID: 1, state: 'off'},
                          {relayID: 2, state: 'off'},
                          {relayID: 3, state: 'off'},
                          {relayID: 4, state: 'off'},
                          {relayID: 5, state: 'off'},
                          {relayID: 6, state: 'off'},
                          {relayID: 7, state: 'off'},
                          {relayID: 8, state: 'off'}];

// Queue manager for changing relay's states.
var changeRelayStateQueue = async.queue(function(task, callback){
    changeRelayState(task.relayID, task.state, callback);
}, 1);


// Change specific relay state on/off.
function changeRelayState(relayID, state, callback){
    // Convert relayID number to the corresponding bit mask.
    // If relayID = 3 -> relayMask = 0b0100
    var relayMask = 1<<(relayID-1);
    var relayBoardState;    // Retrieve all on and off relay from the board.
    
    // Get relay board state.    
    i2cWire.readBytes(i2cGPIO0, 1, function(err, res){
        if(err) return err;
        
        // Get relay board state
        relayBoardState = res.readUInt8(0);
        
        if(state === 'on'){
            relayBoardState = relayBoardState | relayMask;
        }
        // If state is 'off'.
        else{
            // Only if relay is on, turn it off.
            if(relayBoardState & relayMask)
                relayBoardState = relayBoardState ^ relayMask;
        }
        
        // Write new relay board state.
        i2cWire.writeBytes(i2cGPIO0, [relayBoardState], function(err){
            if(err)  return callback(err, relayBoardState);
            callback(null, relayBoardState);
        });
    });
}


async.series([
    function (cb){
      i2cWire =  new i2c(i2cAddress, {device: '/dev/i2c-1'}); // point to your i2c address, debug provides REPL interface 
      cb(null);
    },
    function(cb){
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
    function(cb){
        // Set GPIO1 port from I2C device as outputs.
        i2cWire.writeBytes(i2cIODIR1, [0x0], function(err){
            if(err){
                console.log('Error configuring GPIO1 port as output: ' + err);
                return cb(err);
            }
            console.log('GPIO1 ports set successfully as outputs.');
            cb(null);
        });
    },
    function(cb){
        // This won't work because as they are running concurrently 
        // both will use the same relayBoardState. Only relay 2 will be set to on.
        changeRelayState(1,'on', function(err, relayBoardState){
            if(err) return cb(err);
            console.log("New relay board state is: " + relayBoardState.toString(2));
        });
        changeRelayState(2,'on', function(err, relayBoardState){
            if(err) return cb(err);
            console.log("New relay board state is: " + relayBoardState.toString(2));
        });
        cb(null);
    },
    function(cb){
        changeRelayStateQueue.push(relayArrayOnState, function(err, relayBoardState){
            if(err) return cb(err);
            console.log("New relay board state is: " + relayBoardState.toString(2));
        });
        
        changeRelayStateQueue.push(relayArrayOffState, function(err, relayBoardState){
            if(err) return cb(err);
            console.log("New relay board state is: " + relayBoardState.toString(2));
        });
        
        changeRelayStateQueue.push(relayArrayOnState, function(err, relayBoardState){
            if(err) return cb(err);
            console.log("New relay board state is: " + relayBoardState.toString(2));
        });
        
        cb(null);
    }
  ], 
  function(err){
    if(err) throw err;
});


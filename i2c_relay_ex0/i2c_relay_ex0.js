// Toggle relay

var async = require('async');
var i2c = require('i2c');

// I2C device configuration address and registers.
var i2cAddress = 0x20;
var i2cIODIR0 = 0x6;
var i2cIODIR1 = 0x7;
var i2cGPIO0 = 0x0;
var i2cGPIO1 = 0x1;



var i2cWire = null;
var state = 0;
var timer = null;


function toggle(){
    state = state ? 0 : 1;
    if(state === 0) {
        i2cWire.writeBytes(i2cGPIO0, [0xff], function(err){
            if(err) console.log(err);
        });
        i2cWire.writeBytes(i2cGPIO1, [0x0], function(err){
            if(err) console.log(err);
        });
    }
    else{
        i2cWire.writeBytes(i2cGPIO0, [0x0], function(err){
            if(err) console.log(err);
        });
        i2cWire.writeBytes(i2cGPIO1, [0xff], function(err){
            if(err) console.log(err);
        });
    }
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
    function(cb){
        timer = setInterval(toggle, 1000);
        setTimeout(function(){
            console.log('Stop toggling.');
            clearInterval(timer);
        }, 10000);
        cb(null);
    }
  ], 
  function(err) {
    if(err) throw err;
});
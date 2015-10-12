// Toggle relay

var async = require('async');
var i2c = require('i2c-bus');
var i2c1;

// I2C device configuration address and registers.
var i2cAddress = 0x20;
var i2cIODIR0 = 0x6;
var i2cIODIR1 = 0x7;
var i2cGPIO0 = 0x0;
var i2cGPIO1 = 0x1;


var state = 0;
var timer = null;

var writeBuf = new Buffer(2);

function toggle(){
    state = state ? 0 : 1;
    if(state === 0) {
        writeBuf[0] = i2cGPIO0;
        writeBuf[1] = 0x0;
        var writeBuf0 = new Buffer([i2cGPIO0 , 0x0]);
        i2c1.i2cWrite(i2cAddress, 2, writeBuf0, function(err){
            if(err) console.log(err);
        });
        writeBuf[0] = i2cGPIO1;
        writeBuf[1] = 0xff;
        var writeBuf1 = new Buffer([i2cGPIO1 , 0xff]);
        i2c1.i2cWrite(i2cAddress, 2, writeBuf1, function(err){
            if(err) console.log(err);
        });
    }
    else{
        writeBuf[0] = i2cGPIO0;
        writeBuf[1] = 0xff;
        var writeBuf0 = new Buffer([i2cGPIO0 , 0xff]);
        i2c1.i2cWrite(i2cAddress, 2, writeBuf0, function(err){
            if(err) console.log(err);
        });
        writeBuf[0] = i2cGPIO1;
        writeBuf[1] = 0x0;
        var writeBuf1 = new Buffer([i2cGPIO1 , 0x0]);
        i2c1.i2cWrite(i2cAddress, 2, writeBuf1, function(err){
            if(err) console.log(err);
        });
    }
}

async.series([
    function (cb) {
      i2c1 =  i2c.open(1, cb); // point to your i2c address, debug provides REPL interface 
    },
    function(cb) {
        // Set GPIO0 port from I2C device as outputs.
        writeBuf[0] = i2cIODIR0;
        writeBuf[1] = 0x0;
        i2c1.i2cWrite(i2cAddress, 2, writeBuf, function(err){
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
        writeBuf[0] = i2cIODIR1;
        writeBuf[1] = 0x0;
        i2c1.i2cWrite(i2cAddress, 2, writeBuf, function(err){
            if(err){
                console.log('Error configuring GPIO1 port as output: ' + err);
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
// dummy streaming
var Readable = require('stream').Readable;
var dummyStreamer = {
  stream: null,
  maxIterations: 20,
  currentIterations: 0,
  intervalInst: null,
  paused: false,
  packetInterval: 1000,
  packetContent: new Uint8Array([1,2,3,4]), // four byte array

  start: function(){

    console.log(`packets starting`);
    if(this.stream == null) {
      this.stream = new Readable();
      this.stream._read = function noop() {}; // redundant? see update below
    }

    this.intervalInst = this.customSetInterval(function(){
      dummyStreamer.pushPacket(dummyStreamer.packetContent);
    }, this.packetInterval);
    // this.intervalInst = setInterval(function(){
    //   dummyStreamer.pushPacket(dummyStreamer.packetContent);
    // }, this.packetInterval);
  },
  pushPacket: function(data) {
    var arrayBuffer = Buffer.from(data); // convert to buffer
    this.stream.push(arrayBuffer);
  },
  setRate: function(rate){
    this.end();
    this.packetInterval = 1000 * (1/rate);
    this.start();
  },
  pause: function(){
    this.paused = true;
    this.end();
    console.log(`readable paused`);
  },
  resume: function(){
    this.paused = false;
    this.start();
  },
  getStream: function(){
    return this.stream;
  },
  end: function(){
    clearTimeout(this.intervalInst.id);
    console.log(`packets stopping`);
  },
  isPaused: function() {
    return this.paused;
  },
  destroy: function() {
    //this.stream.destroy();
    this.stream = null;
  },
  customSetInterval: function (func, time){
    var lastTime = Date.now(),
        lastDelay = time,
        outp = {};

    function tick(){
        func();

        var now = Date.now(),
            dTime = now - lastTime;

        lastTime = now;
        lastDelay = time + lastDelay - dTime;
        outp.id = setTimeout(tick, lastDelay);
    }
    outp.id = setTimeout(tick, time);

    return outp;
  }
};
module.exports = dummyStreamer;

// send serial data via bluetooth once conection is established

// var SerialPort = require('serialport');
// var port = new SerialPort('/dev/tty-usbserial1', {
//   baudRate: 57600
// });
var serialPorts = [];

var SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const parser = new Readline();

// callback approach
SerialPort.list(function (err, ports) {
  console.log(ports);
  ports.forEach(function(port) {
    serialPorts.push(port);
    console.log(port.comName);
    console.log(port.pnpId);
    console.log(port.manufacturer);
  });

  var portInstance = null;
  for (var p of serialPorts) {
    if (p.hasOwnProperty('comName') && p.comName == '/dev/tty.Bluetooth-Incoming-Port') {
      portInstance = new SerialPort(p.comName, { autoOpen: false });
      portInstance.pipe(parser);
      portInstance.open(function (err) {
        if (err) {
          return console.log('Error opening port: ', err.message);
        }

        // Because there's no callback to write, write errors will be emitted on the port:
        portInstance.write('main screen turn on');
      });

      // The open event is always emitted
      portInstance.on('open', function() {
        // open logic
        console.log("did open...:");
        portInstance.write("We have liftoff..");
      });


      // portInstance.on('readable', function () {
      //   console.log('Data:', portInstance.read());
      // });

      parser.on('data', function(parsedData) {
        console.log("parsedData: "+parsedData);

        portInstance.write("im responding with: "+parsedData);
      });
    }
  }


});

let Capture;
let savedImage;
let button;
let pixy = [];
let maxDiam = 100;
let numeros = [];
let newTextX;
let counter = 0;
let go = false;

var serial;          // variable to hold an instance of the serialport library
var portName = '/dev/cu.usbmodem1411'; // fill in your serial port name here

function setup() {
  createCanvas(600, 400);
  background(0);

  serial = new p5.SerialPort();    // make a new instance of the serialport library
  serial.on('list', printList);    // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen);     // callback for the port opening
  serial.on('data', serialEvent);  // callback for when new data arrives
  serial.on('error', serialError); // callback for errors
  serial.on('close', portClose);   // callback for the port closing

  serial.list();                   // list the serial ports
  serial.open(portName);           // open a serial port

  button = createButton("Save Image");
  button.position(width - 90, height - 30);
  button.mousePressed(saveImage);

  reset = createButton("Reset");
  reset.position(70, height-30);
  reset.mousePressed(resetSketch);

  pause = createButton("Pause");
  pause.position(13, height - 30);
  pause.mousePressed(pauseSketch);

  resetSketch();

}

function draw() {
  background(0);
 	//image(savedImage,0,0);

  for (let i = 0; i < height / maxDiam; i ++) {
    for (let j = 0; j < width / maxDiam; j ++) {
      fill(122);
      textAlign(CENTER);
      textSize(maxDiam / 2);
      ellipse(j * maxDiam + maxDiam / 2, i * maxDiam + maxDiam / 2,
        pixy[i][j], pixy[i][j])
      //text(pixy[i][j], j * maxDiam + maxDiam / 2, i * maxDiam + maxDiam / 2)
    }
  }

  if (counter = numeros.length) {
    textAlign(CENTER);
    fill(255);
    textSize(50);
    text("FINISHED")
  }

  // if (play == false){
  //   fill(255, 0, 0);
  //   textAlign(LEFT);
  //   textSize(maxDiam / 2);
  //   for (let i = 0; i < numeros.length; i++){
  //     text(numeros[i], newTextX + i * maxDiam, 250);
  //   }
  //   newTextX -= 5;
  // }


  // if (play == true) {
  //   for (let i = 0; i < width / maxDiam; i ++) {
  //     for (let j = 0; j < height / maxDiam; j ++) {
  //       pixy[i][j] = randomRadius();
  //       fill(255);
  //       ellipse(i * maxDiam + maxDiam / 2, j * maxDiam + maxDiam / 2, pixy[i][j], pixy[i][j]);
  //     }
  //   }
  // } else {
  //   for (let i = 0; i < width / maxDiam; i ++) {
  //     for (let j = 0; j < height / maxDiam; j ++) {
  //       fill(255);
  //       ellipse(i * maxDiam + maxDiam / 2, j * maxDiam + maxDiam / 2, pixy[i][j], pixy[i][j]);
  //     }
  //   }
  // }
}

function resetSketch() {
  let counter = 0;
  // Capture = createCapture(VIDEO);
  // Capture.size(320, 240);
  // Capture.hide();
  newTextX = width;

  for (let i = 0; i < height / maxDiam; i += 1){
    pixy[i] = [];
  }

  for (let i = 0; i < height / maxDiam; i ++) {
    for (let j = 0; j < width / maxDiam; j ++) {
      pixy[i][j] = random(0, maxDiam);
      counter++;
    }
  }
  go = false;
}

function saveImage() {
  //savedImage = Capture.get();

  //place all values into a single one dimensional array that goes left to right
  //and right to left
  for (let i = 0; i < height / maxDiam; i++) {
    if (i % 2 == 0) {
      for (let j = 0; j < width / maxDiam; j++) {
        numeros.push(pixy[i][j]);
      }
    } else {
      for (let j = width / maxDiam - 1; j >= 0; j--) {
        numeros.push(pixy[i][j]);
      }
    }
  }
  go = true;
  serial.write("go");
}

function pauseSketch() {
  go = false;
}

function goSketch() {
  go = true;
}

// function makePixels(img, x, y) {
//   let imgPixel = img;
//   let pixelX = x;
//   let pixelY = y;
//   let a = 0;
//
// 	a = img.get(pixelX * maxDiam, pixelY * maxDiam);
//   return int(brightness(a));
// }


function serialEvent(){
  let inString = serial.readStringUntil('\r\n');
  if (go == true){ //user starts the plotting features
    let movingRight = true;

    if (counter < numeros.length && inString == "r"){
      serial.write(int(map(numeros[counter], 0, 383, 0, 255)));
      print(map(numeros[counter], 0, 383, 0, 255));
      serial.write(",");
      print(",");

  //is the line an odd line or even one?
      if (int(counter / pixy[0].length) % 2 == 0){ //divide the counter number by the row length and see if its even or odd
        movingRight = true;
      }
      if (int(counter / pixy[0].length) % 2 == 1) {
        movingRight = false;
      }

      if (movingRight == true){
        serial.write("t");
        print("t");
      }
      if (movingRight == false){
        serial.write("f");
        print("f");
      }

      serial.write(",");
      print(",");

      if (counter % pixy.length == 0){
        serial.write("t");
        print("t");
      } else {
        serial.write("f");
        print("f");
      }

      serial.write("\n")
      print("\n");

      counter++;
    }
  }
}

function printList(portList) {
  // portList is an array of serial port names
  for (var i = 0; i < portList.length; i++) {
  // Display the list the console:
  print(i + " " + portList[i]);
  }
}

function serverConnected() {
  print('connected to server.');
}

function portOpen() {
  print('the serial port opened.')
}

function serialError(err) {
  print('Something went wrong with the serial port. ' + err);
}

function portClose() {
  print('The serial port closed.');
}

// noprotect

// var serial;          // variable to hold an instance of the serialport library
// var portName = '/dev/cu.usbmodem1411'; // fill in your serial port name here
//
// function setup() {
//   createCanvas(640, 480);          // make canvas
//   smooth();                        // antialias drawing lines
//   serial = new p5.SerialPort();    // make a new instance of the serialport library
//   serial.on('list', printList);    // set a callback function for the serialport list event
//   serial.on('connected', serverConnected); // callback for connecting to the server
//   serial.on('open', portOpen);     // callback for the port opening
//   serial.on('data', serialEvent);  // callback for when new data arrives
//   serial.on('error', serialError); // callback for errors
//   serial.on('close', portClose);   // callback for the port closing
//
//   serial.list();                   // list the serial ports
//   serial.open(portName);           // open a serial port
// }
//
// var locH, locV;        // location of the circle
// var circleColor = 255; // color of the circle
//
// function draw() {
//   background(0);               // black background
//   fill(circleColor);           // fill depends on the button
//   ellipse(locH, locV, 50, 50); // draw the circle
// }
//
// // get the list of ports:
// function printList(portList) {
//   // portList is an array of serial port names
//   for (var i = 0; i < portList.length; i++) {
//   // Display the list the console:
//   print(i + " " + portList[i]);
//   }
// }
//
// function serverConnected() {
//   print('connected to server.');
// }
//
// function portOpen() {
//   print('the serial port opened.')
// }
//
// function serialError(err) {
//   print('Something went wrong with the serial port. ' + err);
// }
//
// function portClose() {
//   print('The serial port closed.');
// }
//
// function serialEvent() {
//   // read a string from the serial port
//   // until you get carriage return and newline:
//   var inString = serial.readStringUntil('\r\n');
//
//   //check to see that there's actually a string there:
//   if (inString.length > 0 ) {
//     var sensors = split(inString, ',');            // split the string on the commas
//     if (sensors.length > 2) {                      // if there are three elements
//       locH = map(sensors[0], 0, 1023, 0,width);   // element 0 is the locH
//       locV = map(sensors[1], 0, 1023, 0, height); // element 1 is the locV
//       circleColor = 255 - (sensors[2] * 255);      // element 2 is the button
//     }
//   }
// }
//

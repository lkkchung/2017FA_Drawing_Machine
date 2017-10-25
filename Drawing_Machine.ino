#include <Servo.h>
Servo penHeight;
int servoPin = 3; //attach the servo to pin 3
int xPlus = 4;
int xMinus = 5;
int yPlus = 6;
int line = 0;
bool go = false;

void setup() {
   // start serial port at 9600 bps:
   Serial.begin(9600);
   penHeight.attach(servoPin);
   pinMode(xPlus, OUTPUT);
   pinMode(xMinus, OUTPUT);
   pinMode(yPlus, OUTPUT);
   //Serial.println("ready");
}
 
void loop() {
  int mappedValue = 0;
  int penHeightOff = 52;
  int penHeightLight = 29;
  int penHeightDark = 19;
  bool movingRight = true;
  bool carriageReturn = false;
  
  //int analogValue = analogRead(A0);
  //int mappedValue = map(analogValue, 0, 1023, 0, 180);
  //Serial.println(mappedValue);

  //Serial.println("ready");
    
  if(Serial.available()) {
    String fromSerial = Serial.readStringUntil('\n');
    
    if (fromSerial == "go") {
      go = true;
      Serial.println("ready");
    }

    if (go == true){
      int firstValueEnd = fromSerial.indexOf(',');                    // find the first comma and tell me how deep into the string it is
      String firstValueString = fromSerial.substring(0,firstValueEnd);// give me a new string that includes everything till the first comma
      int darkness= firstValueString.toInt();                       // give me the int interpretation of that string 
  
      int secondValueEnd = fromSerial.indexOf(',',firstValueEnd+1);                     // search for the second comma, start searching after the first one
      String secondValueString = fromSerial.substring(firstValueEnd+1,secondValueEnd);   //give me a new string with everything beween first and second comma
      if(secondValueString == "t"){
        movingRight = true;  
      } else {
        movingRight = false;
      }
  
      int thirdValueEnd = fromSerial.indexOf(',',secondValueEnd+1);                     
      String thirdValueString = fromSerial.substring(secondValueEnd+1,thirdValueEnd);
  
      if(thirdValueString == "t"){
        carriageReturn = true;
      } else {
        carriageReturn = false;
      }

    
      if(carriageReturn == true) {
        digitalWrite(yPlus, HIGH);
        delay(200);
        digitalWrite(yPlus, LOW);
        delay(200);
        digitalWrite(yPlus, HIGH);
        delay(200);
        digitalWrite(yPlus, LOW);
        delay(200);
        digitalWrite(yPlus, HIGH);
        delay(200);
        digitalWrite(yPlus, LOW);
        delay(200);
        carriageReturn = false;
      }
  
      mappedValue = map(darkness, 0, 255, penHeightLight, penHeightDark);
      penHeight.write(mappedValue);
      delay(200);
      penHeight.write(penHeightOff);
      delay(1000);
  
      if(movingRight == true) {
        digitalWrite(xPlus, HIGH);
        delay(200);
        digitalWrite(xPlus, LOW);
        delay(200);
        digitalWrite(xPlus, HIGH);
        delay(200);
        digitalWrite(xPlus, LOW);
        delay(200);
        digitalWrite(xPlus, HIGH);
        delay(200);
        digitalWrite(xPlus, LOW);
        delay(200);
       }
      
      if(movingRight == false) {
        digitalWrite(xMinus, HIGH);
        delay(200);
        digitalWrite(xMinus, LOW);
        delay(200);
        digitalWrite(xMinus, HIGH);
        delay(200);
        digitalWrite(xMinus, LOW);
        delay(200);
        digitalWrite(xMinus, HIGH);
        delay(200);
        digitalWrite(xMinus, LOW);
        delay(200);
      }

      Serial.println("r");

    }
  }
}

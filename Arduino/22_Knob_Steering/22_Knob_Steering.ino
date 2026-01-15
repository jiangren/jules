/*
  22_Knob_Steering
  方向盘：转动旋钮，同步控制舵机角度
*/

#include <Servo.h>

Servo myServo;

int potPin = A0;  // 电位器
int servoPin = 9; // 舵机

void setup() {
  myServo.attach(servoPin);
}

void loop() {
  // 1. 读取旋钮位置 (0-1023)
  int val = analogRead(potPin);

  // 2. 转换成角度 (0-180)
  // 注意：舵机最多只能转到 180度
  int angle = map(val, 0, 1023, 0, 180);

  // 3. 执行动作
  myServo.write(angle);

  // 舵机反应很快，不需要太长的 delay
  delay(15);
}

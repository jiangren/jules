/*
  25_Waving_Pet
  招财猫/宠物：一直挥手，直到你摸摸它的头
  逻辑：平时 loop 挥手；检测到触摸/按钮，停止挥手卖萌
*/

#include <Servo.h>

Servo armServo;
int touchPin = 2; // 触摸传感器 (Item 67) 或 按钮
int servoPin = 9;

void setup() {
  armServo.attach(servoPin);
  pinMode(touchPin, INPUT); // 触摸模块通常输出 HIGH/LOW
}

void loop() {
  // 读取触摸状态
  int isTouched = digitalRead(touchPin);

  if (isTouched == HIGH) { // 假设摸到是 HIGH
    // 被摸了，害羞不动
    delay(100);
  } else {
    // 没人摸，就开始挥手招揽客人
    waveHand();
  }
}

void waveHand() {
  // 挥手动作
  armServo.write(45);
  delay(300);
  armServo.write(135);
  delay(300);
}

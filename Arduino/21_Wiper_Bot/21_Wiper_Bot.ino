/*
  21_Wiper_Bot
  雨刷机器人：舵机来回扫动
  学习 Servo 库的使用
*/

// 1. 引入舵机库
#include <Servo.h>

// 2. 创建一个舵机对象
Servo myServo;

int servoPin = 9; // 舵机信号线接 Pin 9 (必须是 PWM 口)

void setup() {
  // 3. 告诉 Arduino 舵机接在哪里
  myServo.attach(servoPin);
}

void loop() {
  // 从 0度 转到 180度
  for (int pos = 0; pos <= 180; pos += 1) {
    myServo.write(pos);              // 告诉舵机去这个角度
    delay(15);                       // 等它一会儿，让它转过去
  }

  // 从 180度 转回 0度
  for (int pos = 180; pos >= 0; pos -= 1) {
    myServo.write(pos);
    delay(15);
  }
}

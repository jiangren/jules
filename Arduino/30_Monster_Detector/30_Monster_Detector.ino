/*
  30_Monster_Detector
  综合项目：怪兽探测器
  功能：
  1. 超声波检测前方是否有“怪兽” (距离 < 30cm)
  2. 如果发现：
     - 舵机转动 (攻击/防御)
     - 蜂鸣器报警
     - LED 爆闪
  3. 如果安全：
     - 绿灯常亮
*/

#include <Servo.h>

// 引脚定义
int trigPin = 12;
int echoPin = 11;
int buzzerPin = 8;
int ledRed = 6;
int ledGreen = 5;
int servoPin = 9;

Servo myServo;

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(buzzerPin, OUTPUT);
  pinMode(ledRed, OUTPUT);
  pinMode(ledGreen, OUTPUT);

  myServo.attach(servoPin);
  myServo.write(0); // 初始归位
}

void loop() {
  // 1. 测距
  long duration, cm;
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  duration = pulseIn(echoPin, HIGH);
  cm = duration * 0.034 / 2;

  // 2. 逻辑判断
  if (cm > 0 && cm < 30) {
    // === 发现怪兽模式 ===

    // 绿灯灭
    digitalWrite(ledGreen, LOW);

    // 报警动作：
    // 舵机猛地挥动
    myServo.write(90);

    // 红灯闪 + 蜂鸣器叫
    for(int i=0; i<5; i++) {
      digitalWrite(ledRed, HIGH);
      tone(buzzerPin, 1000);
      delay(100);
      digitalWrite(ledRed, LOW);
      noTone(buzzerPin);
      delay(100);
    }

    // 舵机复位准备下一次攻击
    myServo.write(0);
    delay(500);

  } else {
    // === 安全模式 ===
    digitalWrite(ledGreen, HIGH);
    digitalWrite(ledRed, LOW);
    noTone(buzzerPin);
    myServo.write(0);
  }

  delay(100);
}

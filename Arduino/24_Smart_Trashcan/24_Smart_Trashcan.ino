/*
  24_Smart_Trashcan
  感应垃圾桶：手靠近时，舵机转动打开盖子
  综合运用 超声波传感器 和 舵机
*/

#include <Servo.h>

Servo lidServo;
int trigPin = 12; // 超声波 Trig 发射
int echoPin = 11; // 超声波 Echo 接收
int servoPin = 9;

void setup() {
  Serial.begin(9600);
  lidServo.attach(servoPin);

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  // 初始状态：关盖子 (0度)
  lidServo.write(0);
}

void loop() {
  // 1. 发送超声波脉冲
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  // 2. 接收回波并计算时间 (微秒)
  long duration = pulseIn(echoPin, HIGH);

  // 3. 计算距离 (厘米)
  // 声音速度 340m/s -> 0.034 cm/us
  // 来回距离，所以除以 2
  int distance = duration * 0.034 / 2;

  Serial.print("Distance: ");
  Serial.println(distance);

  // 4. 判断距离
  // 如果有物体小于 15cm (手过来了)
  if (distance > 0 && distance < 15) {
    // 开盖 (转到 90度)
    lidServo.write(90);
    delay(2000); // 保持开启 2秒
  } else {
    // 关盖
    lidServo.write(0);
  }

  delay(100);
}

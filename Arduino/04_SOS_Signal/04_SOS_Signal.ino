/*
  04_SOS_Signal
  国际求救信号：三短、三长、三短 (...) (---) (...)
  演示如何自定义函数来简化代码。
*/

int ledPin = 13;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  // S: 三短
  dot(); dot(); dot();
  delay(300); // 字母间隔

  // O: 三长
  dash(); dash(); dash();
  delay(300); // 字母间隔

  // S: 三短
  dot(); dot(); dot();

  // 发完一轮 SOS 后，等待长一点时间再发下一轮
  delay(2000);
}

// 自定义函数：发一个“短”信号 (.)
void dot() {
  digitalWrite(ledPin, HIGH);
  delay(200);  // 短亮
  digitalWrite(ledPin, LOW);
  delay(200);  // 间隔
}

// 自定义函数：发一个“长”信号 (-)
void dash() {
  digitalWrite(ledPin, HIGH);
  delay(600);  // 长亮 (通常是短亮的3倍)
  digitalWrite(ledPin, LOW);
  delay(200);  // 间隔
}

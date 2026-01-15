/*
  02_Traffic_Light
  模拟交通信号灯：红 -> 黄 -> 绿 顺序切换
*/

int redPin = 11;    // 红灯接在 11 号口
int yellowPin = 12; // 黄灯接在 12 号口
int greenPin = 13;  // 绿灯接在 13 号口

void setup() {
  // 设置这三个引脚都为输出模式
  pinMode(redPin, OUTPUT);
  pinMode(yellowPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
}

void loop() {
  // 1. 红灯亮 (停车)
  digitalWrite(redPin, HIGH);
  digitalWrite(yellowPin, LOW);
  digitalWrite(greenPin, LOW);
  delay(3000); // 红灯持续 3 秒

  // 2. 黄灯亮 (准备) - 通常红灯变绿前黄灯会亮，或者只有黄灯亮
  // 这里我们演示：红灯灭，黄灯亮
  digitalWrite(redPin, LOW);
  digitalWrite(yellowPin, HIGH);
  digitalWrite(greenPin, LOW);
  delay(1000); // 黄灯持续 1 秒

  // 3. 绿灯亮 (通行)
  digitalWrite(redPin, LOW);
  digitalWrite(yellowPin, LOW);
  digitalWrite(greenPin, HIGH);
  delay(3000); // 绿灯持续 3 秒

  // 4. 绿灯灭，准备回到红灯 (这里简化逻辑，直接循环回红灯)
  digitalWrite(greenPin, LOW);
}

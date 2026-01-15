/*
  12_Knob_Dimmer
  旋钮调光：转动电位器，控制 LED 亮度
  学习 analogRead 和 map 函数
*/

int potPin = A0; // 电位器接 模拟口 A0
int ledPin = 9;  // LED 接 PWM 口 9

void setup() {
  pinMode(ledPin, OUTPUT);
  // 模拟输入引脚不需要 pinMode，直接读即可
}

void loop() {
  // 1. 读取旋钮的值
  // analogRead 范围是 0 到 1023
  int potValue = analogRead(potPin);

  // 2. 转换数值
  // LED 亮度范围是 0 到 255
  // 我们需要把 0-1023 映射到 0-255
  int brightness = map(potValue, 0, 1023, 0, 255);

  // 3. 控制 LED
  analogWrite(ledPin, brightness);

  delay(10); // 稍微延时，增加稳定性
}

/*
  15_Sound_Visualize
  声音可视化：对着麦克风吹气或大喊，LED 随音量亮起
*/

int micPin = A0;   // 声音传感器接 A0
int ledPin = 11;   // LED 接 PWM 口 11

void setup() {
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  // 读取声音传感器的模拟值
  // 声音传感器通常输出一个波动的电压
  // 我们读它的“峰值”或者直接读瞬时值
  int soundValue = analogRead(micPin);

  // 打印看看平时安静时是多少
  Serial.println(soundValue);

  // 简单的映射：
  // 假设安静时约 500 (中间电压)
  // 声音大时会偏离 500 (比如变成 800 或 200)
  // 这里我们取绝对偏差值来表示“音量”
  int volume = abs(soundValue - 500);

  // 放大一点灵敏度，让变化更明显 (比如乘 5 倍)
  int brightness = volume * 5;

  // 限制在 0-255 范围内
  if (brightness > 255) brightness = 255;

  analogWrite(ledPin, brightness);

  delay(10); // 快速响应
}

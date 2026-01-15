/*
  20_Theremin_Instrument
  光特雷门琴：光线越强，音调越高
  无需接触即可演奏的神奇乐器
*/

int sensorPin = A0;    // 光敏电阻
int buzzerPin = 8;     // 蜂鸣器

// 设定音调范围
int lowFreq = 200;
int highFreq = 800;

void setup() {
  pinMode(buzzerPin, OUTPUT);
}

void loop() {
  int sensorValue = analogRead(sensorPin);

  // 1. 读取光线值 (假设范围 100-800，需要根据实际环境调整)
  // 2. 映射到频率 (200Hz - 800Hz)
  int pitch = map(sensorValue, 100, 900, lowFreq, highFreq);

  // 3. 发声
  tone(buzzerPin, pitch);

  delay(10);
}

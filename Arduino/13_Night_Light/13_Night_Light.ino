/*
  13_Night_Light
  光感夜灯：天黑了(光敏电阻被遮挡)，灯自动亮起
*/

int lightSensorPin = A0; // 光敏电阻接 A0
int ledPin = 13;

void setup() {
  pinMode(ledPin, OUTPUT);
  // 打开串口监视器，方便我们查看光敏电阻的数值
  Serial.begin(9600);
}

void loop() {
  // 读取亮度值
  // 越亮数值越小，越暗数值越大 (取决于接线方式，通常分压电路是这样)
  int sensorValue = analogRead(lightSensorPin);

  // 打印数值到电脑上，帮助我们调试阈值
  Serial.println(sensorValue);

  // 设定一个阈值 (比如 500)
  // 你需要观察串口监视器的数值来调整这个数
  // 假设：平时是 200，用手遮住变成 800
  if (sensorValue > 600) {
    digitalWrite(ledPin, HIGH); // 太暗了，开灯
  } else {
    digitalWrite(ledPin, LOW);  // 够亮，关灯
  }

  delay(100);
}

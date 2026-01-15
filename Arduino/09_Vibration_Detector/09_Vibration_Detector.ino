/*
  09_Vibration_Detector
  震动检测：敲击桌子，灯光亮起
*/

int vibPin = 2; // 震动传感器
int ledPin = 13;

void setup() {
  pinMode(ledPin, OUTPUT);
  pinMode(vibPin, INPUT_PULLUP);
}

void loop() {
  // 震动传感器平时通常是断开或连通的 (取决于型号)
  // 震动瞬间，状态会快速改变
  int val = digitalRead(vibPin);

  // 假设震动会让它瞬间连通 (LOW)
  if (val == LOW) {
    digitalWrite(ledPin, HIGH);
    delay(500); // 亮半秒，让我们能看清楚
  } else {
    digitalWrite(ledPin, LOW);
  }
}

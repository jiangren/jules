/*
  17_Ambulance
  救护车警报：声音频率连续变化
*/

int buzzerPin = 8;

void setup() {
  pinMode(buzzerPin, OUTPUT);
}

void loop() {
  // 阶段1：声音从低到高 (升调)
  for (int i = 500; i <= 1000; i += 10) {
    tone(buzzerPin, i);
    delay(10); // 每个音调持续一小会儿
  }

  // 阶段2：声音从高到低 (降调)
  for (int i = 1000; i >= 500; i -= 10) {
    tone(buzzerPin, i);
    delay(10);
  }
}

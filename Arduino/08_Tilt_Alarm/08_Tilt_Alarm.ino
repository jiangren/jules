/*
  08_Tilt_Alarm
  倾斜报警器：当物体倾斜时报警
*/

int tiltPin = 2; // 倾斜传感器接 Pin 2
int buzzerPin = 8; // 蜂鸣器接 Pin 8 (或 LED Pin 13)

void setup() {
  pinMode(buzzerPin, OUTPUT);
  pinMode(tiltPin, INPUT_PULLUP); // 同样使用内部上拉
}

void loop() {
  int tiltState = digitalRead(tiltPin);

  // 倾斜开关内部有个小珠子。
  // 倾斜时珠子滚走，断开 (HIGH) 或 连通 (LOW)，取决于传感器类型和角度。
  // 假设：倾斜时变成 HIGH (断开)

  if (tiltState == HIGH) {
    // 报警！
    digitalWrite(buzzerPin, HIGH);
    // 或者发出声音 (如果是无源蜂鸣器需要用 tone，这里假设是有源或仅用LED)
    // 简单起见，如果是有源蜂鸣器，给 HIGH 就响
  } else {
    digitalWrite(buzzerPin, LOW);
  }
}

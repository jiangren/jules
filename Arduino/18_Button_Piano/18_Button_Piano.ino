/*
  18_Button_Piano
  小小钢琴：3个按钮代表 Do, Re, Mi
*/

int buzzerPin = 8;
int btn1 = 2; // Do
int btn2 = 3; // Re
int btn3 = 4; // Mi

// 定义音符频率 (C大调)
int NOTE_C4 = 262; // Do
int NOTE_D4 = 294; // Re
int NOTE_E4 = 330; // Mi

void setup() {
  pinMode(buzzerPin, OUTPUT);
  pinMode(btn1, INPUT_PULLUP);
  pinMode(btn2, INPUT_PULLUP);
  pinMode(btn3, INPUT_PULLUP);
}

void loop() {
  if (digitalRead(btn1) == LOW) {
    tone(buzzerPin, NOTE_C4);
  }
  else if (digitalRead(btn2) == LOW) {
    tone(buzzerPin, NOTE_D4);
  }
  else if (digitalRead(btn3) == LOW) {
    tone(buzzerPin, NOTE_E4);
  }
  else {
    // 如果都没按，停止发声
    noTone(buzzerPin);
  }
}

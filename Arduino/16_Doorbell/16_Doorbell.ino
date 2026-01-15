/*
  16_Doorbell
  电子门铃：按下按钮，发出“叮咚”声
  学习 tone 函数
*/

int buttonPin = 2;
int buzzerPin = 8; // 蜂鸣器接 Pin 8

void setup() {
  pinMode(buttonPin, INPUT_PULLUP);
  pinMode(buzzerPin, OUTPUT);
}

void loop() {
  if (digitalRead(buttonPin) == LOW) {
    // 叮 (频率较高，比如 1000Hz)
    tone(buzzerPin, 1000);
    delay(500);

    // 咚 (频率较低，比如 500Hz)
    tone(buzzerPin, 600);
    delay(800);

    // 停止发声
    noTone(buzzerPin);

    // 简单的防重复触发
    delay(1000);
  }
}

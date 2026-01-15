/*
  06_Button_Control
  按键开关：按住按钮灯亮，松开灯灭
  学习 digitalRead 读取输入信号
*/

int buttonPin = 2; // 按钮接在 Pin 2
int ledPin = 13;   // 灯接在 Pin 13

void setup() {
  pinMode(ledPin, OUTPUT);
  // 使用 INPUT_PULLUP (内部上拉模式)
  // 这意味着：
  // 1. 不按按钮时，引脚读到 HIGH (5V)
  // 2. 按下按钮(接地)时，引脚读到 LOW (0V)
  // 这样接线最简单，不需要外接电阻
  pinMode(buttonPin, INPUT_PULLUP);
}

void loop() {
  // 读取按钮状态
  int buttonState = digitalRead(buttonPin);

  // 如果读到 LOW (说明按钮被按下了)
  if (buttonState == LOW) {
    digitalWrite(ledPin, HIGH); // 点亮灯
  } else {
    digitalWrite(ledPin, LOW);  // 熄灭灯
  }
}

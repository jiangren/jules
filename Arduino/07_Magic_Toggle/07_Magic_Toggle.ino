/*
  07_Magic_Toggle
  神奇开关：按一下开，再按一下关 (自锁开关效果)
  学习“状态检测” (State Change Detection)
*/

int buttonPin = 2;
int ledPin = 13;

int ledState = LOW;         // 记录灯当前是亮还是灭
int lastButtonState = HIGH; // 记录上一次按钮的状态 (默认未按下是HIGH)

void setup() {
  pinMode(ledPin, OUTPUT);
  pinMode(buttonPin, INPUT_PULLUP);
}

void loop() {
  int currentButtonState = digitalRead(buttonPin);

  // 检测“按下的瞬间”：
  // 1. 现在是 LOW (按下了)
  // 2. 上次是 HIGH (没按)
  // 这意味着状态发生了“改变”
  if (lastButtonState == HIGH && currentButtonState == LOW) {
    // 切换灯的状态变量
    if (ledState == LOW) {
      ledState = HIGH;
    } else {
      ledState = LOW;
    }
    // 简单的去抖动 (防止按键接触不良造成误判)
    delay(50);
  }

  // 根据记录的状态去控制灯
  digitalWrite(ledPin, ledState);

  // 记住这次的状态，留给下一次循环做比较
  lastButtonState = currentButtonState;
}

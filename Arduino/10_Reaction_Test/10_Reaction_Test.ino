/*
  10_Reaction_Test
  反应力测试：灯亮后，看谁按得快！
*/

int ledPin = 13;
int buttonPin = 2;

void setup() {
  pinMode(ledPin, OUTPUT);
  pinMode(buttonPin, INPUT_PULLUP);
  // 初始化随机数种子，让每次随机不一样
  randomSeed(analogRead(0));
}

void loop() {
  // 1. 游戏开始前，灯是灭的
  digitalWrite(ledPin, LOW);

  // 2. 等待一个随机的时间 (2秒 到 5秒 之间)
  // 这样玩家就不知道什么时候灯会亮
  int waitTime = random(2000, 5000);
  delay(waitTime);

  // 3. 灯亮！开始计时！
  digitalWrite(ledPin, HIGH);

  // 4. 等待玩家按下按钮
  // 我们做一个死循环，直到按钮被按下
  while (digitalRead(buttonPin) == HIGH) {
    // 只要按钮没按 (HIGH)，就一直在这里转圈圈等待
  }

  // 5. 玩家按下了！灯灭，游戏结束
  digitalWrite(ledPin, LOW);

  // 闪烁两下表示成功
  delay(200);
  digitalWrite(ledPin, HIGH);
  delay(200);
  digitalWrite(ledPin, LOW);
  delay(200);
  digitalWrite(ledPin, HIGH);
  delay(200);
  digitalWrite(ledPin, LOW);

  // 休息 3 秒再开始下一轮
  delay(3000);
}

/*
  05_Running_Lights
  流水灯：让 5 个 LED 依次点亮，像水流一样流动
*/

void setup() {
  // 使用 for 循环一次性设置 9, 10, 11, 12, 13 号口为输出
  // 也可以写 5 行 pinMode...
  for (int i = 9; i <= 13; i++) {
    pinMode(i, OUTPUT);
  }
}

void loop() {
  // 顺序点亮：从 9 到 13
  for (int i = 9; i <= 13; i++) {
    digitalWrite(i, HIGH); // 点亮当前的灯
    delay(100);            // 亮一小会儿
    digitalWrite(i, LOW);  // 熄灭它 (如果不熄灭，就变成进度条效果了)
  }

  // 逆序点亮：从 12 回到 10 (实现往返效果)
  for (int i = 12; i >= 10; i--) {
    digitalWrite(i, HIGH);
    delay(100);
    digitalWrite(i, LOW);
  }
}

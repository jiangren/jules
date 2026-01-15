/*
  01_Hello_Light
  点亮你的第一个灯：让板载 LED (Pin 13) 闪烁。
*/

// setup() 函数在通电后只运行一次
void setup() {
  // 将 13 号引脚设置为输出模式 (OUTPUT)
  // 这样我们才能给它电压，让灯亮起来
  pinMode(13, OUTPUT);
}

// loop() 函数会无限循环运行
void loop() {
  digitalWrite(13, HIGH);  // 给 13 号引脚高电平 (5V)，灯亮
  delay(1000);             // 等待 1000 毫秒 (1秒)

  digitalWrite(13, LOW);   // 给 13 号引脚低电平 (0V)，灯灭
  delay(1000);             // 等待 1000 毫秒 (1秒)
}

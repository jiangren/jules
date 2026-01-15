/*
  14_Color_Mixer
  调色盘：RGB 全彩 LED
  依次展示 红、绿、蓝 以及混合色
*/

// 定义 RGB 灯的三个引脚 (必须是 PWM 引脚)
int redPin = 9;
int greenPin = 10;
int bluePin = 11;

void setup() {
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);
}

void loop() {
  // 红色
  setColor(255, 0, 0);
  delay(1000);

  // 绿色
  setColor(0, 255, 0);
  delay(1000);

  // 蓝色
  setColor(0, 0, 255);
  delay(1000);

  // 黄色 (红+绿)
  setColor(255, 255, 0);
  delay(1000);

  // 紫色 (红+蓝)
  setColor(255, 0, 255);
  delay(1000);

  // 青色 (绿+蓝)
  setColor(0, 255, 255);
  delay(1000);

  // 白色 (全部亮)
  setColor(255, 255, 255);
  delay(1000);
}

// 自定义函数：设置颜色
// r, g, b 范围都是 0-255
void setColor(int r, int g, int b) {
  // 注意：有些 RGB 灯是“共阳极”的。
  // 如果是共阳极：255是灭，0是亮。需要写成 analogWrite(pin, 255 - value);
  // 这里假设是常见的“共阴极”：
  analogWrite(redPin, r);
  analogWrite(greenPin, g);
  analogWrite(bluePin, b);
}

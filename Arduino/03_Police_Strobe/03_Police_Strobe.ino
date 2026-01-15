/*
  03_Police_Strobe
  警灯爆闪：模拟警车的红蓝(或红绿)交替爆闪效果
  爆闪特点是：红灯快闪3次，然后绿灯快闪3次，循环。
*/

int ledA = 12; // 红色 LED
int ledB = 13; // 绿色 LED (或者蓝色、白色)

void setup() {
  pinMode(ledA, OUTPUT);
  pinMode(ledB, OUTPUT);
}

void loop() {
  // 阶段1：红灯急促闪烁 3 次
  for(int i=0; i<3; i++) {
    digitalWrite(ledA, HIGH);
    delay(50);             // 亮 50ms (非常快)
    digitalWrite(ledA, LOW);
    delay(50);             // 灭 50ms
  }

  // 阶段2：绿灯急促闪烁 3 次
  for(int i=0; i<3; i++) {
    digitalWrite(ledB, HIGH);
    delay(50);
    digitalWrite(ledB, LOW);
    delay(50);
  }
}

/*
  11_Breathing_Light
  呼吸灯：LED 慢慢变亮，再慢慢变暗，像呼吸一样
  学习 PWM (脉冲宽度调制) 和 analogWrite
*/

int ledPin = 9; // 注意：必须接在支持 PWM 的引脚 (通常带波浪号~，如 3, 5, 6, 9, 10, 11)

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  // 1. 渐亮过程
  // value 从 0 增加到 255
  for (int value = 0; value <= 255; value += 5) {
    analogWrite(ledPin, value); // 输出模拟值 (亮度)
    delay(30);                  // 稍作停顿，让变化肉眼可见
  }

  // 2. 渐暗过程
  // value 从 255 减少到 0
  for (int value = 255; value >= 0; value -= 5) {
    analogWrite(ledPin, value);
    delay(30);
  }

  // 呼吸结束，休息一下
  delay(500);
}

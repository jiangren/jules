/*
  23_Fan_Controller
  超级风扇：控制直流电机转动
*/

// 电机驱动板 L298N 或者简单的 MOS管 驱动
// 假设使用清单里的 L298N 模块 (Item 84) 或 简单的 ULN2003/三极管
// 这里演示最基础的单向调速 (L298N 的 ENA 和 IN1/IN2)
// 简化版：我们假设用 L9110 或者直接用 MOS管控制单路

// 根据清单 Item 18 "步进电机驱动板" (ULN2003) 和 Item 84 "L298N电机驱动板"
// 我们用 L298N 控制直流马达 (Item 19)

// L298N 接线定义
int enA = 9;   // ENA 接 PWM 口，控制速度
int in1 = 8;   // IN1 控制方向
int in2 = 7;   // IN2 控制方向

void setup() {
  pinMode(enA, OUTPUT);
  pinMode(in1, OUTPUT);
  pinMode(in2, OUTPUT);
}

void loop() {
  // 1. 全速前进
  digitalWrite(in1, HIGH);
  digitalWrite(in2, LOW); // 一高一低，电机正转
  analogWrite(enA, 255);  // 速度最大
  delay(2000);

  // 2. 慢速前进
  analogWrite(enA, 100);  // 速度变慢
  delay(2000);

  // 3. 停止
  digitalWrite(in1, LOW);
  digitalWrite(in2, LOW); // 都是低，刹车
  delay(1000);

  // 4. 反转 (如果接了风扇叶，风向会变)
  digitalWrite(in1, LOW);
  digitalWrite(in2, HIGH); // 反过来了
  analogWrite(enA, 200);
  delay(2000);

  // 停止
  digitalWrite(in1, LOW);
  digitalWrite(in2, LOW);
  delay(1000);
}

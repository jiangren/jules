/*
  29_LCD_Welcome
  液晶显示屏：显示欢迎语 "Hello Baby"
*/

// 需要安装 LiquidCrystal I2C 库
// 搜索 "LiquidCrystal I2C" by Frank de Brabander
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// 设置 LCD 地址，通常是 0x27 或 0x3F
// 1602 表示 16个字符 x 2行
LiquidCrystal_I2C lcd(0x27,16,2);

void setup() {
  // 初始化 LCD
  lcd.init();
  // 打开背光
  lcd.backlight();

  // 第一行显示
  lcd.setCursor(0,0); // 第0列，第0行
  lcd.print("Hello, Baby!");

  // 第二行显示
  lcd.setCursor(0,1); // 第0列，第1行
  lcd.print("I Love You <3");
}

void loop() {
  // 静态显示，loop 里不用做什么
  // 当然，你也可以让文字滚动起来
}

/*
  26_Lucky_Dice
  幸运骰子：按下按钮，数码管快速跳动，松手停在随机数字
*/

// 定义数码管的引脚 (a,b,c,d,e,f,g,dp)
// 这里假设使用直接驱动方式 (需要 7-8 个引脚)
// 如果使用 74HC595 会节省引脚，但逻辑较复杂，初学者直接驱动更直观
// 假设使用 Item 16 "1位数码管"

// 数码管段引脚定义 (根据常见共阴极接法)
int segA = 6;
int segB = 7;
int segC = 8;
int segD = 9;
int segE = 10;
int segF = 11;
int segG = 12;
// dp 不用

int buttonPin = 2;

// 数字 0-9 的编码表 (哪些段亮为1)
// 顺序: A B C D E F G
byte numbers[10][7] = {
  {1,1,1,1,1,1,0}, // 0
  {0,1,1,0,0,0,0}, // 1
  {1,1,0,1,1,0,1}, // 2
  {1,1,1,1,0,0,1}, // 3
  {0,1,1,0,0,1,1}, // 4
  {1,0,1,1,0,1,1}, // 5
  {1,0,1,1,1,1,1}, // 6
  {1,1,1,0,0,0,0}, // 7
  {1,1,1,1,1,1,1}, // 8
  {1,1,1,1,0,1,1}  // 9
};

void setup() {
  pinMode(segA, OUTPUT);
  pinMode(segB, OUTPUT);
  pinMode(segC, OUTPUT);
  pinMode(segD, OUTPUT);
  pinMode(segE, OUTPUT);
  pinMode(segF, OUTPUT);
  pinMode(segG, OUTPUT);

  pinMode(buttonPin, INPUT_PULLUP);
  randomSeed(analogRead(0));
}

void loop() {
  if (digitalRead(buttonPin) == LOW) {
    // 按钮按下时，快速随机显示数字 (滚动效果)
    int randNum = random(1, 7); // 骰子通常是 1-6
    showNumber(randNum);
    delay(50); // 滚动速度
  }
  // 松手后，就停在最后那个数字上了，不动
}

void showNumber(int num) {
  digitalWrite(segA, numbers[num][0]);
  digitalWrite(segB, numbers[num][1]);
  digitalWrite(segC, numbers[num][2]);
  digitalWrite(segD, numbers[num][3]);
  digitalWrite(segE, numbers[num][4]);
  digitalWrite(segF, numbers[num][5]);
  digitalWrite(segG, numbers[num][6]);
}

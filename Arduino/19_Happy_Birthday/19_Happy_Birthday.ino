/*
  19_Happy_Birthday
  自动播放：祝你生日快乐
  学习数组 (Array)
*/

int buzzerPin = 8;

// 定义音符频率
#define NOTE_C4  262
#define NOTE_D4  294
#define NOTE_E4  330
#define NOTE_F4  349
#define NOTE_G4  392
#define NOTE_A4  440
#define NOTE_B4  494
#define NOTE_C5  523

// 乐谱：祝你生日快乐 (C调)
// 5 5 6 5 1(高) 7
int melody[] = {
  NOTE_G4, NOTE_G4, NOTE_A4, NOTE_G4, NOTE_C5, NOTE_B4,
  NOTE_G4, NOTE_G4, NOTE_A4, NOTE_G4, NOTE_D5, NOTE_C5
};
// 补全定义 D5
#define NOTE_D5 587

// 节拍：4 = 四分音符, 8 = 八分音符
// 对应上面的音符
int noteDurations[] = {
  8, 8, 4, 4, 4, 2,
  8, 8, 4, 4, 4, 2
};

void setup() {
  pinMode(buzzerPin, OUTPUT);

  // 播放歌曲 (只播一次)
  // 这里的 12 是音符的总数
  for (int thisNote = 0; thisNote < 12; thisNote++) {

    // 计算音符持续时间：1000ms / 节拍类型
    // 比如四分音符 = 1000 / 4 = 250ms
    int noteDuration = 1000 / noteDurations[thisNote];

    tone(buzzerPin, melody[thisNote], noteDuration);

    // 为了让音符之间分得清，我们需要在两个音之间留一点点空隙
    // 通常设置为音符时长的 1.3 倍
    int pauseBetweenNotes = noteDuration * 1.30;
    delay(pauseBetweenNotes);

    // 停止当前音符
    noTone(buzzerPin);
  }
}

void loop() {
  // 这里的代码是空的，所以歌曲播完一遍就停止了。
  // 如果你想循环播放，就把 setup 里的代码搬到这里来。
}

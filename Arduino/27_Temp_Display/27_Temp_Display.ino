/*
  27_Temp_Display
  温度监视器：读取 DHT11 温湿度传感器并在串口显示
*/

// 需要安装 DHT 库。
// 在 Arduino IDE -> 工具 -> 管理库 -> 搜索 "DHT sensor library" by Adafruit
#include "DHT.h"

#define DHTPIN 2     // 信号线接 Pin 2
#define DHTTYPE DHT11   // 型号选择 DHT11

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
  Serial.println("DHT11 Test Start!");
}

void loop() {
  delay(2000); // DHT11 采样率较慢，至少等 2 秒

  // 读取湿度
  float h = dht.readHumidity();
  // 读取温度 (摄氏度)
  float t = dht.readTemperature();

  // 检查读取是否失败
  if (isnan(h) || isnan(t)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  // 打印结果
  Serial.print("Humidity: ");
  Serial.print(h);
  Serial.print("%  Temperature: ");
  Serial.print(t);
  Serial.println("°C");
}

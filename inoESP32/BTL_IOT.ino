#include <WiFi.h>
#include <stdlib.h>            // Thêm thư viện chuẩn cho các hàm như malloc, free
#include "DHTesp.h"            // Thêm thư viện cho cảm biến DHT
#include <ArduinoJson.h>       // Thêm thư viện để làm việc với JSON
#include <PubSubClient.h>      // Thêm thư viện để làm việc với MQTT
#include <WiFiClientSecure.h>  // Thêm thư viện cho kết nối WiFi an toàn

/**** Cài đặt cho cảm biến DHT11 *******/
#define DHTpin 4     //
#define LED1_PIN 17  // 
#define LED2_PIN 18  // 
#define LED3_PIN 19  // 

#define mqtt_topic_pub "sensor"
#define mqtt_topic_sub "led_status"
DHTesp dht;

/**** Cài đặt LED *******/
const int led1 = LED1_PIN;
const int led2 = LED2_PIN;
const int led3 = LED3_PIN;

boolean stled1 = false;
boolean stled2 = false;
boolean stled3 = false;


unsigned long previousBlinkTime = 0;
const long blinkInterval = 25;  // Thời gian nhấp nháy nhanh hơn (0.025 giây)
  // Thời gian nhấp nháy (0.05 giây)
bool blinkState = false;

// int randomValue;  // Biến lưu giá trị ngẫu nhiên

/****** Chi tiết kết nối WiFi *******/
const char* ssid = "Samsung S25 Ultra";
const char* password = "11114444";
/******* Chi tiết kết nối với máy chủ MQTT *******/
const char* mqtt_server = "1c0787fe98d845fea408181bfc94d923.s1.eu.hivemq.cloud";
const char* mqtt_username = "vanvu";
const char* mqtt_password = "E!hU2TJUGSSJjqb";
const int mqtt_port = 8883;

/**** Khởi tạo kết nối WiFi an toàn *****/
WiFiClientSecure espClient;

/**** Khởi tạo MQTT Client sử dụng kết nối WiFi *****/
PubSubClient client(espClient);

unsigned long lastMsg = 0;
#define MSG_BUFFER_SIZE (50)
char msg[MSG_BUFFER_SIZE];

/************* Kết nối đến WiFi ***********/
void setup_wifi() {
  delay(10);
  Serial.print("\nĐang kết nối đến ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);  // Thiết lập chế độ WiFi là station
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print("w");
  }
  randomSeed(micros());
  Serial.println("\nKết nối WiFi thành công\nĐịa chỉ IP: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  // Lặp cho đến khi kết nối thành công
  while (!client.connected()) {
    Serial.print("Đang cố gắng kết nối MQTT...");
    String clientId = "ESP32Client-";  // Tạo một ID ngẫu nhiên cho client
    clientId += String(random(0xffff), HEX);
    // Thử kết nối
    if (client.connect(clientId.c_str(), mqtt_username, mqtt_password)) {
      Serial.println("đã kết nối");

      client.subscribe(mqtt_topic_sub);
      Serial.print("Đã đăng ký topic ");
      Serial.println(mqtt_topic_sub);  // Đăng ký topic tại đây

    } else {
      Serial.print("thất bại, rc=");
      Serial.print(client.state());
      Serial.println(" thử lại sau 5 giây");  // Đợi 5 giây trước khi thử lại
      delay(5000);
    }
  }
}


void callback(char* topic, byte* payload, unsigned int length) {
  String incommingMessage = "";
  for (int i = 0; i < length; i++) incommingMessage += (char)payload[i];

  Serial.println("Tin nhắn đến [" + String(topic) + "]" + incommingMessage);
  // Kiểm tra tin nhắn đến
  if (strcmp(topic, mqtt_topic_sub) == 0) {
    // Phân tích đối tượng JSON
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, incommingMessage);
    int led_id = doc["led_id"];
    String status = doc["status"];
    // Giải mã JSON/Lấy giá trị
    Serial.print("Led id: ");
    Serial.print(led_id);
    Serial.println(" Trạng thái: " + status);
    if (led_id == 1) {
      if (status.equals("ON")) {
        stled1 = true;
        digitalWrite(led1, HIGH);  // Bật LED1
      } else {
        stled1 = false;
        digitalWrite(led1, LOW);  // Tắt LED1
      }
    } else if (led_id == 2) {
      if (status.equals("ON")) {
        stled2 = true;
        digitalWrite(led2, HIGH);  // Bật LED 2
      } else {
        stled2 = false;
        digitalWrite(led2, LOW);  // Tắt LED 2
      }
    } else if (led_id == 3) {
      if (status.equals("ON")) {
        stled3 = true;
        digitalWrite(led3, HIGH);  // Bật LED 3
      } else {
        stled3 = false;
        digitalWrite(led3, LOW);  // Tắt LED 3
      }
    } 
    char mqtt_message[256];
    serializeJson(doc, mqtt_message);
    client.publish("led_data", mqtt_message);
  }
}

void publishMessage(const char* topic, String payload, boolean retained) {
  if (client.publish(topic, payload.c_str(), true))
    Serial.println("[" + String(topic) + "]: " + payload);
}

void setup() {
  dht.setup(DHTpin, DHTesp::DHT11);  // Cài đặt cảm biến DHT11
  pinMode(led1, OUTPUT);
  pinMode(led2, OUTPUT);
  pinMode(led3, OUTPUT);

  Serial.begin(115200);
  setup_wifi();

  espClient.setInsecure();

  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);

}

void loop() {
  if (!client.connected()) reconnect();  // Kiểm tra nếu client chưa kết nối
  client.loop();

  long now = millis();
  if (now - lastMsg > 5000) {
    int sensorValue = analogRead(A0);  // Đọc giá trị từ chân ADC (A0)
    float light = sensorValue;
    float humidity = dht.getHumidity();
    float temperature = dht.getTemperature();

    lastMsg = now;
    DynamicJsonDocument doc(1024);
    doc["humidity"] = humidity;
    doc["temperature"] = temperature;
    doc["light"] = light;
    doc["led1"]["id"] = 1;
    doc["led1"]["status"] = stled1;
    doc["led2"]["id"] = 2;
    doc["led2"]["status"] = stled2;
    doc["led3"]["id"] = 3;
    doc["led3"]["status"] = stled3;

    char mqtt_message[256];
    serializeJson(doc, mqtt_message);
    publishMessage("esp_data", mqtt_message, true);
  }
}

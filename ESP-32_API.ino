#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <FS.h>
#include <SPIFFS.h>

const char* ssid = "GR OPERATIVA";
const char* password = "Hazlo SENCILLO";
const int relayPin = 23; // Cambiado a GPIO 23 para el LED externo

AsyncWebServer server(80);  // Asegúrate de que esta línea esté a nivel global, no dentro de ninguna función
unsigned long relayTurnOffMillis = 0;   // Para manejar el apagado automático

void setup() {
      pinMode(relayPin, OUTPUT);  // Configura el pin 23 como salida
    digitalWrite(relayPin, LOW); // Asegura que el LED está apagado al iniciar

    Serial.begin(115200);
    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }

    Serial.println("");
    Serial.println("WiFi connected.");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());

    if (!SPIFFS.begin(true)) {
        Serial.println("An Error has occurred while mounting SPIFFS");
        return;
    } else {
        Serial.println("SPIFFS mounted successfully");
    }
     Serial.println("Listando archivos almacenados en SPIFFS:");
    File root = SPIFFS.open("/");
  if (!root) {
    Serial.println("Failed to open directory");
    return;
  }
  if (!root.isDirectory()) {
    Serial.println("Not a directory");
    return;
  }

  File file = root.openNextFile();
  while (file) {
    Serial.print("File: ");
    Serial.print(file.name());
    Serial.print(" Size: ");
    Serial.println(file.size());
    file = root.openNextFile();
    
  }
  
    // Configuración de rutas del servidor
    server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
        request->send(SPIFFS, "/index.html", "text/html");
    });
    
     // Ruta para el home
    server.on("/home.html", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/home.html", "text/html");
    });
    // Ruta para cargar el archivo CSS
    server.on("/css/contacto.css", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/css/contacto.css", "text/css");
    });
  
    server.on("/css/menu.css", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/css/menu.css", "text/css");
    });
    // Ruta de imagenes
    server.on("/images/fondo.jpg", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/images/fondo.jpg", "images/jpeg");
    });
    
    server.on("/images/imgcamara.jpg", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/images/imgcamara.jpg", "images/jpeg");
    });

    server.on("/images/imgcerradura.jpg", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/images/imgcerradura.jpg", "images/jpeg");
    });

    server.on("/images/imgluces.jpg", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/images/imgluces.jpg", "images/jpeg");
    });

    server.on("/images/imgpersiana.jpg", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/images/imgpersiana.jpg", "images/jpeg");
    });

    server.on("/images/fav.png", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/images/fav.png", "image/png");
    });
    
    // Ruta para el archivo SVG
    server.on("/images/responsive.svg", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/images/responsive.svg", "image/svg+xml");
    });

   
    server.on("/images/responsive2.svg", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/images/responsive2.svg", "image/svg+xml");
    });

    

    //ruta de javascript
    server.on("/js/login.js", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/js/login.js", "application/javascript");
    });

    server.on("/js/boton.js", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/js/boton.js", "application/javascript");
    });

   // Handle HTTP requests for the LED toggle
    server.on("/toggleLED", HTTP_GET, [](AsyncWebServerRequest *request){
        String state = request->getParam("state")->value();
        digitalWrite(relayPin, state == "1" ? HIGH : LOW); 
        if (state == "1") {
            relayTurnOffMillis = millis() + 5000;  // Ajusta el tiempo según lo necesario
        }
        request->send(200, "text/plain", "Relay Toggled");
    });
    
    server.begin();
    Serial.println("HTTP server started");
}

void loop() {
      if (relayTurnOffMillis != 0 && millis() > relayTurnOffMillis) {
        digitalWrite(relayPin, LOW);
        relayTurnOffMillis = 0;  
    }
}

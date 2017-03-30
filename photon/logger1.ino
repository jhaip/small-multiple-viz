// The on-board LED
int led = D7;
int count = 0;

void publishValueMessage(int value) {
  char str[100];
  // sprintf( str, "{\"type\": \"BINARY\", \"label\": \"A0\", \"value\": %d}", value );
  sprintf( str, "%d", value );
  Particle.publish("value", str, PRIVATE);
}

void publishStartMessage() {
  Particle.publish("value", "START", PRIVATE);
}

void setup() {
  pinMode(led, OUTPUT);
  publishStartMessage();
}
void loop() {
  // Turn the LED Off
  digitalWrite(led, HIGH);
  // Publish an event to trigger the integration
  // Replace "my-event" with the event name you used when configuring the integration
  // Replace "test-data" with the real data you'd like to send to Google Cloud Platform
  publishValueMessage(count);

  // Wait for 3 seconds
  delay(3000);

  count += 1;
  publishValueMessage(count);

  // Turn the LED off
  digitalWrite(led, LOW);
  delay(3000);

  count += 1;
  if (count >= 100) {
      count = 0;
  }
}

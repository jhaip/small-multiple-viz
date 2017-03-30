int led1 = D0; // Instead of writing D0 over and over again, we'll write led1
int led2 = D7; // Instead of writing D7 over and over again, we'll write led2
int delay_ms = 200;

void setup() {
  pinMode(led1, OUTPUT);
  pinMode(led2, OUTPUT);
}

void loop() {
  digitalWrite(led1, HIGH);
  digitalWrite(led2, HIGH);

  delay(delay_ms);

  digitalWrite(led1, LOW);
  digitalWrite(led2, LOW);

  delay(delay_ms);
}



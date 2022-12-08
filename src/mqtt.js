const mqtt = require("mqtt");
const client = mqtt.connect(process.env.MQTT_HOST);

client.on("connect", () => {
  client.subscribe(process.env.MQTT_TOPIC, (err) => {
    if (!err) {
      client.publish(process.env.MQTT_TOPIC, "Hello mqtt");
    }
  });
});

client.on("message", (topic, message) => {
  console.log(message.toString());
  // client.end();
});

module.exports = client;

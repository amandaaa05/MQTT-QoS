import mqtt from "mqtt";

const client = mqtt.connect("mqtt://localhost:1883");

client.on("connect", () => {
  console.log("PUB conectado");

  let i = 0;

  const enviar = () => {
    const msg = `msg-${i}`;

    client.publish("aula/qos", msg, { qos: 2 }, () => {
      console.log("PUB enviou:", msg);
    });

    i++;

    if (i < 5) {
      setTimeout(enviar, 1000);
    } else {
      console.log("PUB finalizou");
      client.end();
    }
  };

  enviar();
});
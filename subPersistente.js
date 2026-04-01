import mqtt from "mqtt";

const client = mqtt.connect("mqtt://localhost:1883", {
  clientId: "sub-qos2",
  clean: false // 🔥 ESSENCIAL para manter a sessão
});

const recebidas = new Set();

client.on("connect", () => {
  console.log("SUB conectado");

  client.subscribe("aula/qos", { qos: 2 }, () => {
    console.log("SUB inscrito em aula/qos QoS2");
  });
});

client.on("message", (topic, msg) => {
  const mensagem = msg.toString();

  if (recebidas.has(mensagem)) {
    console.log("❌ DUPLICADA:", mensagem);
  } else {
    recebidas.add(mensagem);
    console.log("✅ RECEBIDA:", mensagem);
  }
});
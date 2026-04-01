import mqtt from "mqtt";

// Sensor 2: Nível do Reservatório de Água (Importante)
// QoS 1 - "At least once" (garante entrega, pode duplicar)
// Não pode perder nenhuma leitura - sistema de irrigação depende desses dados
// clean: false + clientId fixo = sessão persistente (Broker guarda mensagens offline)
const options = {
  clientId: "sensor_nivel_agua_01",
  clean: false,
};

const client = mqtt.connect("mqtt://localhost:1883", options);

client.on("connect", () => {
  console.log("💧 Sensor Nível de Água: conectado ao broker");

  setInterval(() => {
    // Simula nível do reservatório entre 0% e 100%
    const nivel = (Math.random() * 100).toFixed(1);
    const status =
      nivel < 20 ? "CRITICO" : nivel < 50 ? "BAIXO" : "NORMAL";

    const payload = JSON.stringify({
      sensor: "nivel_reservatorio",
      valor: parseFloat(nivel),
      unidade: "%",
      status,
      timestamp: new Date().toISOString(),
    });

    // QoS 1: Broker confirma recebimento (PUBACK)
    // Se não receber confirmação, o client reenvia (pode duplicar)
    client.publish("estufa/agua/nivel", payload, { qos: 1 }, () => {
      console.log(`💧 Publicou: ${nivel}% [${status}] (QoS 1 - confirmado)`);
    });
  }, 30000);
});

client.on("error", (err) => {
  console.error("💧 Erro no sensor de nível de água:", err.message);
});

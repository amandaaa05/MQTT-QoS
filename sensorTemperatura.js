import mqtt from "mqtt";

// Sensor 1: Temperatura Ambiente (Não Crítico)
// QoS 0 - "At most once" (fire and forget)
// OK perder algumas leituras, prioriza velocidade
const client = mqtt.connect("mqtt://localhost:1883");

client.on("connect", () => {
  console.log("🌡️  Sensor Temperatura: conectado ao broker");

  setInterval(() => {
    // Simula temperatura entre 18°C e 35°C
    const temperatura = (18 + Math.random() * 17).toFixed(1);
    const payload = JSON.stringify({
      sensor: "temperatura_ambiente",
      valor: parseFloat(temperatura),
      unidade: "°C",
      timestamp: new Date().toISOString(),
    });

    client.publish("estufa/temp/ambiente", payload, { qos: 0 });
    console.log(`🌡️  Publicou: ${temperatura}°C (QoS 0)`);
  }, 5000);
});

client.on("error", (err) => {
  console.error("🌡️  Erro no sensor de temperatura:", err.message);
});

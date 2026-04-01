import mqtt from "mqtt";

// Sensor 3: Detector de Incêndio (Crítico)
// QoS 2 - "Exactly once" (sem perda, sem duplicação)
// Dispara sistema de extinção automática - duplicação causaria desperdício,
// perda pode ser fatal. QoS 2 usa handshake de 4 passos:
// PUBLISH → PUBREC → PUBREL → PUBCOMP
const options = {
  clientId: "sensor_incendio_01",
  clean: false,
};

const client = mqtt.connect("mqtt://localhost:1883", options);

client.on("connect", () => {
  console.log("🔥 Detector de Incêndio: conectado ao broker (monitorando...)");

  // Simula detecção aleatória de fumaça/fogo a cada 10s de verificação
  setInterval(() => {
    const fumacaDetectada = Math.random() < 0.50; // 15% de chance por ciclo

    if (fumacaDetectada) {
      const severidade = Math.random() < 0.3 ? "FOGO" : "FUMACA";

      const payload = JSON.stringify({
        sensor: "detector_incendio",
        tipo: severidade,
        alerta: true,
        acao: "ATIVAR_EXTINCAO_AUTOMATICA",
        timestamp: new Date().toISOString(),
      });

      // QoS 2: Garante entrega EXATAMENTE UMA VEZ
      // Handshake completo de 4 etapas impede perda E duplicação
      client.publish("estufa/alerta/incendio", payload, { qos: 2 }, () => {
        console.log(
          `🚨 ALERTA ${severidade}! Mensagem entregue com QoS 2 (exactly once)`
        );
      });
    }
  }, 10000);
});

client.on("error", (err) => {
  console.error("🔥 Erro no detector de incêndio:", err.message);
});

import mqtt from "mqtt";

// Subscriber da Estufa - recebe dados de todos os sensores
// Sessão persistente para não perder mensagens QoS 1 e 2 quando offline
const options = {
  clientId: "central_estufa_01",
  clean: false,
};

const client = mqtt.connect("mqtt://localhost:1883", options);

client.on("connect", (connack) => {
  console.log(
    `🌿 Central da Estufa: conectada (Sessão recuperada: ${connack.sessionPresent})`
  );

  // Assina cada tópico com o QoS correspondente ao sensor
  client.subscribe("estufa/temp/ambiente", { qos: 0 }); // Temperatura - ok perder
  client.subscribe("estufa/agua/nivel", { qos: 1 }); // Água - não pode perder
  client.subscribe("estufa/alerta/incendio", { qos: 2 }); // Incêndio - exatamente 1x
  client.subscribe("estufa/controle/bomba", { qos: 1 }); // Controle - recebido do Node-RED

  console.log("📡 Assinado em todos os tópicos da estufa");
});

client.on("message", (topic, msg) => {
  const dados = JSON.parse(msg.toString());
  const hora = new Date(dados.timestamp).toLocaleTimeString("pt-BR");

  switch (topic) {
    case "estufa/temp/ambiente":
      console.log(`🌡️  [${hora}] Temperatura: ${dados.valor}${dados.unidade}`);
      break;

    case "estufa/agua/nivel":
      console.log(
        `💧 [${hora}] Nível de Água: ${dados.valor}${dados.unidade} [${dados.status}]`
      );
      if (dados.status === "CRITICO") {
        console.log("⚠️  ATENÇÃO: Nível crítico! Irrigação comprometida!");
      }
      break;

    case "estufa/alerta/incendio":
      console.log(`\n🚨🚨🚨 [${hora}] ALERTA DE INCÊNDIO! 🚨🚨🚨`);
      console.log(`   Tipo: ${dados.tipo}`);
      console.log(`   Ação: ${dados.acao}`);
      console.log(`   🧯 Sistema de extinção ATIVADO!\n`);
      break;

    case "estufa/controle/bomba":
      const estado = dados.ligada ? "LIGADA" : "DESLIGADA";
      console.log(`\n⚙️  [${hora}] COMANDO DE CONTROLE RECEBIDO ⚙️`);
      console.log(`   Ação: Bomba de Irrigação ${estado} remotamente (via Node-RED)\n`);
      break;
  }
});

client.on("error", (err) => {
  console.error("🌿 Erro na central da estufa:", err.message);
});

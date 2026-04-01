## Projeto MQTT utilizando QoS
### Integrantes:
- Amanda Acosta de Andrade
- Davi Pelloso
- Edson Hila Guillen Lopes

### Perguntas
- Utilizamos o QoS 0 para o Sensor 1, pois ele realiza o envio dos dados sem necessidade de confirmação, o que reduz o consumo de energia e aumenta a velocidade de transmissão. Como possíveis perdas de mensagens não impactam significativamente o sistema, esse nível de QoS é suficiente.
- Utilizamos o QoS 1 para o Sensor 2, pois é necessário garantir que as informações sejam entregues ao menos uma vez. Embora possa haver duplicidade de mensagens, isso não compromete o processamento dos dados, tornando esse nível de QoS adequado ao cenário.
- Utilizamos o QoS 2 para o Sensor 3, pois o dado não pode ser perdido nem duplicado. Além disso, esse sensor não envia informações com alta frequência, então não há urgência no tempo de envio. Por outro lado, o dado em si é importante, o que exige alta confiabilidade na entrega, justificando o uso do QoS 2.

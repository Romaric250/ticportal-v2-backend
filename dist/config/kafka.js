import { Kafka } from "kafkajs";
import { env } from "./env.js";
// Only initialize Kafka if explicitly enabled
export const kafka = env.isKafkaActive
    ? new Kafka({
        clientId: "ticportal-v2-backend",
        brokers: env.kafkaBrokers,
    })
    : null;
//# sourceMappingURL=kafka.js.map
import { Kafka } from "kafkajs";
import { env } from "./env";
export const kafka = new Kafka({
    clientId: "ticportal-v2-backend",
    brokers: env.kafkaBrokers,
});
//# sourceMappingURL=kafka.js.map
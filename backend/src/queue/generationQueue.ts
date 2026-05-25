import { Queue } from "bullmq"
import IORedis from "ioredis"

// const connection=
// new IORedis({
// maxRetriesPerRequest:null
// })

// export const generationQueue=
// new Queue(
// "question-generation",
// {
// connection
// }
// )
// Example inside your Express route file or queue setup file:
const queueRedisConnection = new IORedis(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
  maxRetriesPerRequest: null,
});

const assignmentQueue = new Queue("assignment-generation", {
  connection: queueRedisConnection,
});
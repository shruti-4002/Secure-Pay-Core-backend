const { Worker } = require("bullmq");
const redis = require("../config/redisConfig");
const { sendWelcomeEmail, sendTransactionEmail, sendTransactionFailureEmail } = require("../utils/mailer");

const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    const { type, data } = job.data;

    switch (type) {
      case "WELCOME_EMAIL":
        await sendWelcomeEmail(data.email, data.name);
        break;
      case "TRANSACTION_SUCCESS":
        await sendTransactionEmail(data.email, data.name, data.amount, data.toAccount);
        break;
      case "TRANSACTION_FAILURE":
        await sendTransactionFailureEmail(data.email, data.name, data.amount, data.toAccount);
        break;
      default:
        console.log(`Unknown email job type: ${type}`);
    }
  },
  { connection: redis ,
    prefix: "{fintech_email}"
  }
);

emailWorker.on("completed", (job) => {
  console.log(`Email Job ${job.id} (${job.data.type}) processed successfully!`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`Email Job ${job?.id} failed:`, err.message);
});

module.exports = emailWorker;
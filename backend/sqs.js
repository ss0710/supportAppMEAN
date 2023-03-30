require("dotenv").config();
const { SQS } = require("aws-sdk");
const { Consumer } = require("sqs-consumer");
const { AbortController } = require("abort-controller");

const queueUrl =
  "https://sqs.ap-northeast-1.amazonaws.com/838998125604/support_queue";

const sqs = new SQS({
  region: "ap-northeast-1",
  accessKeyId: SQS_ACCESS_KEY,
  secretAccessKey: SQS_SECRET_ACCESS_KEY,
});

function addTicket(message) {
  console.log("message received from sqs");
  console.log(message);
}

const abortController = new AbortController();

// Create our consumer
const app = Consumer.create({
  queueUrl: queueUrl,
  handleMessage: async (message) => {
    addTicket(message);
  },
  sqs: sqs,
  abortController: abortController,
});

app.on("error", (err) => {
  console.error(err.message);
});

app.on("processing_error", (err) => {
  console.error(err.message);
});

console.log("Add ticket service is running");
app.start();

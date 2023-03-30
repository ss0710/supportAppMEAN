const { SQS } = require("aws-sdk");
const { Consumer } = require("sqs-consumer");
const { AbortController } = require("abort-controller");

const queueUrl =
  "https://sqs.ap-northeast-1.amazonaws.com/838998125604/support_queue";

const sqs = new SQS({
  region: "ap-northeast-1",
  accessKeyId: "AKIA4GWBPNQSKQKZUO5W",
  secretAccessKey: "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",
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

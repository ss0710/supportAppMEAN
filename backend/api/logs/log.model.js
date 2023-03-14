var mongoose = require("mongoose");

var logSchema = new mongoose.Schema({
  brandId: {
    type: String,
    required: true,
  },
  ticketId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: [
      "create",
      "assign",
      "accept",
      "inprocess",
      "resolve",
      "close",
      "comment",
      "others",
    ],
    required: true,
  },
  message: {
    type: String,
  },
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
  },
  time: {
    type: Date,
    retuired: true,
  },
});

var Log = mongoose.model("Log", logSchema);

module.exports = Log;

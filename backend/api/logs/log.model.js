var mongoose = require("mongoose");

var logSchema = new mongoose.Schema({
  brand: {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
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
  creator: {
    userName: {
      type: String,
    },
    type: {
      type: String,
      enum: ["admin", "manager", "agent"],
    },
  },
  message: {
    type: String,
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

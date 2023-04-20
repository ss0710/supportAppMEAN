var mongoose = require("mongoose");

var ticketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    unique: true,
    required: true,
  },
  brand: {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  status: {
    type: String,
    enum: [
      "Created",
      "Assigned",
      "Accepted",
      "Rejected",
      "inProcess",
      "resolved",
      "Closed",
    ],
    required: true,
  },
  subject: {
    type: String,
  },
  query: {
    type: String,
  },
  createdBy: {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    createdAt: {
      type: Date,
    },
  },
  resolvedBy: {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    resolvedAt: {
      type: Date,
    },
  },
  agent: {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  customer: {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    createdAt: {
      type: Date,
    },
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

var Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;

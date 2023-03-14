var mongoose = require("mongoose");

var ticketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    unique: true,
    required: true,
  },
  brandId: {
    type: String,
  },
  brandName: {
    type: String,
  },
  status: {
    type: String,
    enum: [
      "Created",
      "Assigned",
      "Accepted",
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
  createdAt: {
    type: Date,
    required: true,
  },
  createdByUserID: {
    type: String,
  },
  createdByUserName: {
    type: String,
  },
  resolvedAt: {
    type: Date,
  },
  resolvedByUserId: {
    type: String,
  },
  resilvedByUserName: {
    type: String,
  },
  agentUserId: {
    type: String,
  },
  agentName: {
    type: String,
  },
  customerId: {
    type: String,
  },
  isDisable: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

var Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;

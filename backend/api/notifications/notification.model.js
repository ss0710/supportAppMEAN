var mongoose = require("mongoose");

var notificationSchema = new mongoose.Schema({
  notificationType: {
    type: String,
    enum: ["manager", "agent"],
    required: true,
  },
  brandId: {
    type: String,
    required: true,
  },
  ticketId: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  creator: {
    id: {
      type: String,
    },
    name: {
      type: String,
    },
    time: {
      type: Date,
    },
  },
  receiver: {
    id: {
      type: String,
    },
    name: {
      type: String,
    },
  },
  isSeen: {
    type: Boolean,
    default: false,
  },
});

var Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;

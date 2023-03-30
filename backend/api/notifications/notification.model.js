var mongoose = require("mongoose");

var notificationSchema = new mongoose.Schema({
  notificationType: {
    type: String,
    enum: ["manager", "agent"],
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
  message: {
    type: String,
    required: true,
  },
  creator: {
    userName: {
      type: String,
    },
    time: {
      type: Date,
    },
  },
  receiver: {
    userName: {
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

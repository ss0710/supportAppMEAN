var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
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
    trim: true,
  },
  content: {
    type: String,
  },
  sentBy: {
    userName: {
      type: String,
    },
    email: {
      type: String,
    },
    type: {
      type: String,
      enum: ["admin", "manager", "agent"],
    },
  },
  time: {
    type: Date,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    required: true,
  },
});

var Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;

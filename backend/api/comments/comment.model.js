var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
  commentId: {
    type: String,
    unique: true,
    trim: true,
  },
  ticketId: {
    type: String,
    required: true,
    trim: true,
  },
  ticketSubject: {
    type: String,
  },
  ticketQuery: {
    type: String,
  },
  content: {
    type: String,
  },
  sentByUserId: {
    type: String,
    required: true,
  },
  sentByUserName: {
    type: String,
    required: true,
  },
  sentByUserType: {
    type: String,
    required: true,
  },
  brand: {
    brandId: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
    },
    category: {
      type: String,
      enum: [
        "Food",
        "Corporate",
        "Banking",
        "Aviation",
        "Private",
        "Sports",
        "Transport",
        "Others",
      ],
    },
  },
  dateAndTime: {
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

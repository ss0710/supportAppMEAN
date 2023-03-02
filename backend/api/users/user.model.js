var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["superAdmin", "brandAdmin", "manager", "agent", "customer"],
    required: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
  },
  userName: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    maxLength: 20,
  },
  password: {
    type: String,
    required: true,
    minLength: 7,
  },
  profileImage: {
    type: String,
  },
  profileImageKey: {
    type: String,
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
    phoneNumber: {
      type: String,
    },
    address: {
      type: String,
    },
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

var User = mongoose.model("User", userSchema);

module.exports = User;

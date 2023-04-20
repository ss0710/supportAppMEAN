var mongoose = require("mongoose");

var brandSchema = new mongoose.Schema({
  brandId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  brandLogo: {
    type: String,
  },
  brandLogoKey: {
    type: String,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
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
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  isAdminCreated: {
    type: Boolean,
    default: false,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  isFirstLogin: {
    type: Boolean,
    default: true,
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

var Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;

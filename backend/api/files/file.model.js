var mongoose = require("mongoose");

var fileSchema = new mongoose.Schema({
  ticket: {
    type: String,
  },
  brand: {
    name: {
      type: String,
    },
  },
  link: {
    type: String,
  },
  addedBy: {
    name: {
      type: String,
    },
    type: {
      type: String,
    },
    time: {
      type: Date,
    },
  },
  isDeleted: {
    type: Boolean,
    required: true,
  },
});

var File = mongoose.model("File", fileSchema);

module.exports = File;

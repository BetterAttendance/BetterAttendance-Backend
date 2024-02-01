const mongoose = require("mongoose");

const questionSchema = mongoose.Schema(
  {
    _id: String,
    type: String,
    answer: String,
  },
  {
    versionKey: false, // Disable the __v field whenever use patch method
  },
);

module.exports = mongoose.model("Question", questionSchema);

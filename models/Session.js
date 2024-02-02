const mongoose = require("mongoose");

const sessionSchema = mongoose.Schema(
  {
    _id: String,
    host: String,
  },
  {
    versionKey: false, // Disable the __v field whenever use patch method
  },
);

module.exports = mongoose.model("Session", sessionSchema);

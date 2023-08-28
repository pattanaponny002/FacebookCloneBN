const mongoose = require("mongoose");

const Friend = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
    lastest_Message: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Friend", Friend);

const mongoose = require("mongoose");

const Conversation = new mongoose.Schema(
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
module.exports = mongoose.model("Conversations", Conversation);

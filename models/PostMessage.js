const mongoose = require("mongoose");

const PostMessage = new mongoose.Schema(
  {
    text: {
      type: String,
    },
    senderId: {
      type: String,
    },
    sendAt: {
      type: String,
    },
    photoURL: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PostMessage", PostMessage);

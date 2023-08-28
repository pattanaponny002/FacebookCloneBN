const mongoose = require("mongoose");

const Message = new mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    text: {
      type: String,
    },
    senderId: {
      type: String,
    },
    receiverId: {
      type: String,
    },
    photoURL: {
      type: String,
    },
    sendAt: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", Message);

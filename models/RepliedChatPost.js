const mongoose = require("mongoose");

const RepliedChatPost = new mongoose.Schema(
  {
    message_id: {
      type: String,
    },
    username: {
      type: String,
    },
    senderId: {
      type: String,
    },
    toReplies: {
      type: String,
    },
    text: {
      type: String,
    },
    photoURL: {
      type: String,
    },
    sendAt: {
      type: String,
    },
    imageURL: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RepliedChatPost", RepliedChatPost);

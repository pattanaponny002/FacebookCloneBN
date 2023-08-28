const mongoose = require("mongoose");

const ChatPost = new mongoose.Schema(
  {
    post_id: {
      type: String,
    },
    username: {
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
    imageURL: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatPost", ChatPost);

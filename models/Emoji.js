const mongoose = require("mongoose");

const Reactions = new mongoose.Schema({
  like: {
    type: Number,
  },
  love: {
    type: Number,
  },
  hug: {
    type: Number,
  },
  laughing: {
    type: Number,
  },
  funny: {
    type: Number,
  },
  greedy: {
    type: Number,
  },
  cool: {
    type: Number,
  },
  angry: {
    type: Number,
  },
  sad: {
    type: Number,
  },
});
const Emoji = new mongoose.Schema(
  {
    post_id: {
      type: String,
    },
    username: {
      type: String,
    },
    reactions: Reactions,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Emoji", Emoji);

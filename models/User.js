const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    username: {
      require: true,
      type: String,
    },
    password: {
      require: true,
      type: String,
    },
    email: {
      type: String,
    },

    phone_number: {
      type: String,
    },
    photoURL: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", User);

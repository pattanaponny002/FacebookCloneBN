const express = require("express");

const router = express.Router();
const RepliedChatPost = require("../models/RepliedChatPost");

const mongoose = require("mongoose");

const dotenv = require("dotenv");
const bcryptjs = require("bcryptjs");

const jwt = require("jsonwebtoken");
const { unsubscribe } = require("./route_user");

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("router repliedChat DB"));
dotenv.config();

function session_verification(req, res, next) {
  const token = req.cookies.accessToken;
  console.log("token", token);
  jwt.verify(token, process.env.REACT_SECRET_KEY, (err, user) => {
    if (!err) {
      req.dd = user;
      next();
    } else {
      res.status(201).json({ message: "session had been terminated..!!" });
    }
  });
}

router.post("/add", async (req, res) => {
  const {
    message_id,
    username,
    text,
    senderId,
    toReplies,
    photoURL,
    sendAt,
    imageURL,
  } = req.body;
  console.log("ADDED RepliedChatPost", req.body);
  const result = await RepliedChatPost.create({
    message_id,
    username,
    senderId,
    text,
    toReplies,
    photoURL,
    sendAt,
    imageURL,
  });

  res.status(200).json({ message: "added RepliedChatPost", result });
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const result = await RepliedChatPost.find({
    message_id: id,
  });

  res.status(200).json({
    message: "this conversationId retreived RepliedChatPost..!!",
    result,
  });
});
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const result = await RepliedChatPost.deleteOne({
    message_id: id,
  });

  res.status(200).json({ message: "found one RepliedChatPost", result });
});

module.exports = router;

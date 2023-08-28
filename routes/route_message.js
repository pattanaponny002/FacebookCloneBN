const express = require("express");

const router = express.Router();
const Message = require("../models/Message");

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
  .then(() => console.log("router message DB"));
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
  const { senderId, receiverId, text, photoURL, sendAt, conversationId } =
    req.body;
  console.log("ADDED MESSAGE", text);
  const result = await Message.create({
    senderId,
    receiverId,
    text,
    photoURL,
    sendAt,
    conversationId,
  });

  res.status(200).json({ message: "added MEssage", result });
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const result = await Message.find({
    conversationId: id,
  });

  res
    .status(200)
    .json({ message: "this conversationId retreived message..!!", result });
});
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const result = await Message.deleteOne({
    conversationId: id,
  });

  res.status(200).json({ message: "found one message", result });
});

module.exports = router;

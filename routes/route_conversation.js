const express = require("express");

const router = express.Router();
const Conversation = require("../models/Conversation");

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
  .then(() => console.log("router conversation DB"));
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
router.post("/updateLatest", async (req, res) => {
  const { latestMessage, _id } = req.body;
  /// findby_id then updates
  try {
    const result = await Conversation.updateOne({
      _id,
      latestMessage,
    });
    res.status(200).json({ message: "lastest've been updated ...!!", result });
  } catch (err) {
    res.status(400).json({ message: "Failed..!!", err });
  }
});

async function checkAdded(req, res, next) {
  console.log("ADDED CONVERASTION");
  const { senderId, receiverId } = req.body;
  const result = await Conversation.find({
    members: { $all: [senderId, receiverId] },
  });
  if (result.length !== 0) {
    res.status(200).json({ message: "Already added", result: result[0] });
  } else {
    next();
  }
}
router.post("/add", checkAdded, async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
  } catch (err) {
    res.status(400).json({ message: "Failed..!!", err });
  }
  const result = await Conversation.create({ members: [senderId, receiverId] });
  // const result = new
  res
    .status(200)
    .json({ message: "messages've been added ...!!", result: result[0] });
});
router.get("/find/:id", async (req, res) => {
  const { id } = req.params;
  console.log("senderID", id);
  try {
    const result = await Conversation.findOne({
      members: { $in: [id] },
    });
    res
      .status(200)
      .json({ message: "find conversation is related to..!!", result });
  } catch (err) {
    res.status(400).json({ message: "Failed..!!", err });
  }
});

module.exports = router;

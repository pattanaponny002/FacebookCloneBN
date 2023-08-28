const express = require("express");

const router = express.Router();
const ChatPost = require("../models/ChatPost");

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
  .then(() => {
    // const changestream = ChatPost.watch({ fullDocument: "updateLookup" });
    // changestream.on("change", (change) => {
    //   console.log("change", change.fullDocument);
    // });
    console.log("router repliedChat DB");
  });
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
//model

router.post("/add", async (req, res) => {
  const {
    post_id,
    username,
    text,
    senderId,
    receiverId,
    photoURL,
    sendAt,
    imageURL,
  } = req.body;
  console.log("ADDED CHATPOST", req.body);
  const result = await ChatPost.create({
    post_id,
    username,
    senderId,
    receiverId,
    text,
    photoURL,
    sendAt,
    imageURL,
  });

  res.status(200).json({ message: "added ChatPost", result });
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const result = await ChatPost.find({
    post_id: id,
  });

  res
    .status(200)
    .json({ message: "this conversationId retreived ChatPost..!!", result });
});
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const result = await ChatPost.deleteOne({
    post_id: id,
  });

  res.status(200).json({ message: "found one ChatPost", result });
});

module.exports = router;

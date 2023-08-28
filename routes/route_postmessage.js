const express = require("express");

const router = express.Router();
const PostMessage = require("../models/PostMessage");

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
  .then(() => console.log("router postmessage DB"));
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
  const { senderId, text, photoURL, sendAt } = req.body;
  console.log("ADDED POSTMESSAGE", req.body);
  const result = await PostMessage.create({
    senderId,
    text,
    photoURL,
    sendAt,
  });
  console.log("POST SUCCEED");
  res.status(200).json({ message: "added POST", result });
});

router.get("/fetch", async (req, res) => {
  const result = await PostMessage.find({
    senderId: { $exists: true },
  });

  res.status(200).json({ message: "FETCH NEW POST..!!", result });
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const result = await PostMessage.find({
    senderId: id,
  });

  res
    .status(200)
    .json({ message: "this conversationId retreived POST..!!", result });
});
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const result = await PostMessage.deleteOne({
    _id: id,
  });

  res.status(200).json({ message: "found one POST", result });
});

module.exports = router;

const express = require("express");

const router = express.Router();
const Emoji = require("../models/Emoji");

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
    const changestream = Emoji.watch({ fullDocument: "updateLookup" });

    changestream.on("change", (doc) => {
      console.log(doc.fullDocument);
    });
    console.log("router Emoji DB");
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
async function checkAdded(req, res, next) {
  console.log("FIND");
  const { post_id, username, reactions } = req.body;
  const result = await Emoji.find({
    username,
    post_id,
  });
  if (result.length !== 0) {
    res.status(200).json({ message: "Already added", result });
  } else {
    next();
  }
}
router.post("/add", checkAdded, async (req, res) => {
  const { post_id, username, reactions } = req.body;
  console.log("ADDED Emoji", req.body);

  const result = await Emoji.create({
    post_id,
    username,
    reactions,
  });
  res.status(200).json({ message: "added Emoji", result });
});
router.post("/update", async (req, res) => {
  const { post_id, username, reactions } = req.body;
  console.log("UPDATE Emoji", username, ":", reactions);

  const result = await Emoji.updateOne({
    post_id,
    username,
    reactions,
  });

  res.status(200).json({ message: "updated Emoji", result });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const result = await Emoji.find({
    post_id: id,
  });

  res.status(200).json({ message: "this post_id retreived Emoji..!!", result });
});
router.get("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const result = await Emoji.deleteOne({
    post_id: id,
  });
  console.log("delete");
  res.status(200).json({ message: "found one Emoji", result });
});

module.exports = router;

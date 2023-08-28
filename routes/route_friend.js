const express = require("express");

const router = express.Router();
const Friend = require("../models/Friend");

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
  .then(() => console.log("router friend DB"));
dotenv.config();

router.post("/add", async (req, res) => {
  const { senderId, receiverId } = req.body;
  console.log("ADDED");
  const result = await Friend.create({
    members: [senderId, receiverId],
  });

  res.status(200).json({
    message: "Added friend successfully..!!",
    result: result,
  });
});
router.post("/delete", async (req, res) => {
  const { senderId, receiverId } = req.body;
  console.log("DELETED");
  const result = await Friend.deleteOne({
    members: [senderId, receiverId],
  });

  res.status(200).json({ message: "Deleted friend successfully..!!", result });
});

router.get("/find/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Friend.find({
      members: { $in: [id] },
    });

    res
      .status(200)
      .json({ message: "FETCH CHAT Friend is related to..!!", result });
  } catch (err) {
    res.status(400).json({ message: "Failed..!!", err });
  }
});
router.get("/fetch/:id", async (req, res) => {
  const { id } = req.params;
  console.log("senderID", id);
  try {
    const result = await Friend.find({
      members: { $in: [id] },
    });

    res
      .status(200)
      .json({ message: "fetch Friend is related to sender..!!", result });
  } catch (err) {
    res.status(400).json({ message: "Failed..!!", err });
  }
});
module.exports = router;

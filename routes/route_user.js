const express = require("express");

const router = express.Router();
const User = require("../models/User");

const mongoose = require("mongoose");

const dotenv = require("dotenv");
const bcryptjs = require("bcryptjs");

const jwt = require("jsonwebtoken");

dotenv.config();
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("router user DB"));
router.post("/add", async (req, res) => {
  console.log("hello", req.body);
  try {
    const { username, password, photoURL, phone_number } = req.body;
    const salt = await bcryptjs.genSalt(10);

    const hash_password = await bcryptjs.hash(password, salt);

    console.log(hash_password);
    const result = await User.create({
      username,
      password: hash_password,
      photoURL,
      phone_number,
    });
    res.status(200).json({ message: "Register Successfully..!!)", result });
  } catch (err) {
    res.status(400).json({ message: "Failed..!!", err });
  }
});

function authenticationToken(req, res, next) {
  const token = req.cookies.accessToken; // req.cookies
  //verify form token ,process real first ,secret env/hash behind

  jwt.verify(token, process.env.REACT_SECRET_KEY, (err, user) => {
    if (!err) {
      req.dd = user;
      next();
    } else {
      res.status(400).json({ err });
    }
  });
}
router.post("/login", async (req, res) => {
  console.log("login");

  const { username, password } = req.body;

  try {
    const result = await User.findOne({
      username,
    });
    const checked = await bcryptjs.compare(password, result.password);
    if (checked) {
      console.log("JSON_JWT");
      const jwt_code = jwt.sign({ username }, process.env.REACT_SECRET_KEY, {
        expiresIn: "30m",
      });
      res
        .cookie("accessToken", jwt_code, { httpOnly: true })
        .status(200)
        .json({ message: "Found", jwt_code, result });
    } else {
      res.status(201).json({ message: "notFount" });
    }
  } catch (err) {
    res.status(400).json({ message: "Failed..!!", err });
  }
});

router.get("/search", async (req, res) => {
  const { name } = req.query;
  console.log("name", name);
  const reg = new RegExp(name, "i");
  try {
    const result = await User.find({
      username: { $regex: reg },
    });
    res.status(200).json({ message: "Found name", result });
  } catch (err) {
    res.status(400).json({ message: "Failed..!!", err });
  }
});
router.patch("/updateProfile", async (req, res) => {
  const { username, phone_number, photoURL } = req.body;
  console.log("UPDATE PROFILE");
  try {
    const result = await User.updateOne({
      username,
      phone_number,
      photoURL: photoURL,
    });
    res.status(200).json({ message: "Update profile", result });
  } catch (err) {
    res.status(400).json({ message: "Failed..!!", err });
  }
});
router.get("/find", async (req, res) => {
  const { name } = req.query;
  console.log("dd", name);
  try {
    const result = await User.findOne({
      username: name,
    });
    res.status(200).json({ message: "Found name", result });
  } catch (err) {
    res.status(400).json({ message: "Failed..!!", err });
  }
});

router.get("/findByID/:id", async (req, res) => {
  // console.log("getFriend", req.params);
  const { id } = req.params;
  // console.log("fetchbyID");
  try {
    const result = await User.findById(id);

    res.status(200).json({ message: "getFriend", user: req.dd, result });
  } catch (err) {
    res.status(400).json({ message: "Failed..!!", err });
  }
});

module.exports = router;

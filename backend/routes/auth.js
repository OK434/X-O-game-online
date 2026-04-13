const express = require('express');
const bcrypt = require('bcrypt');
require('dotenv').config();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const router = express.Router();
router.post("/signup", async (req, res) => {
  try {
    const { email, password, userName } = req.body;
    if (!email || !password || !userName) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPass, userName });
    res.json({ message: "User created" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Email not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Wrong password" });
  }

const token = jwt.sign(
    { userId: user._id },
     process.env.JWT_SECRET ,
    { expiresIn: "24h" }

);

  res.json({ message: "Login successful", token });
});
router.get("/users", async (req, res) => {
  try {
   const token= req.headers.authorization?.split(" ")[1];
   if(!token){
    return res.status(401).json({ message: "No token provided" });
   }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

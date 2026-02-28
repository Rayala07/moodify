const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");

async function registerUser(req, res) {
  const { username, email, password } = req.body;

  const isUserExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserExists) {
    return res.status(403).json({
      message: "User already exists",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await userModel.create({
    username,
    email,
    password: hashPassword,
  });

  res.status(201).json({
    message: "User Registered Successfully",
    newUser: {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    },
  });
}

module.exports = {
  registerUser,
};

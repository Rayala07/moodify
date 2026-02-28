const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
require("dotenv").config();

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

  const token = jwt.sign(
    {
      _id: newUser._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "3d",
    },
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "User Registered Successfully",
    newUser: {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    },
  });
}

async function loginUser(req, res) {
  const { username, email, password } = req.body;

  const isUser = await userModel
    .findOne({
      $or: [{ username }, { email }],
    })
    .select("+password");

  if (!isUser) {
    return res.status(404).json({
      message: "Invalid Credentials",
    });
  }

  const isValidPassword = await bcrypt.compare(password, isUser.password);

  if (!isValidPassword) {
    return res.status(401).json({
      message: "Invalid Credentials",
    });
  }

  const token = jwt.sign(
    {
      _id: isUser._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "3d",
    },
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "Login Successful",
    user: {
      _id: isUser._id,
      username: isUser.username,
      email: isUser.email,
    },
  });
}

async function logoutUser(req, res) {
  const token = req.cookies.token;

  res.clearCookie("token");

  res.json({
    token,
  });
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};

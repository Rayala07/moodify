const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, "username should be unique"],
    required: [true, "username is required"],
  },
  email: {
    type: String,
    unique: [true, "email should be unique"],
    required: [true, "email is required"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
    select: false,
  },
});

module.exports = mongoose.model("users", userSchema);
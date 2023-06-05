var mongoose = require("mongoose");
var crypto = require("crypto");
var jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  language: {
    type: String,
    enum: ["en", "sl"],
    default: "en",
  },
  currency: {
    type: String,
    required: true,
    ref: "Currency",
    default: "EUR",
  },
  theme: {
    type: String,
    required: true,
    enum: ["light", "dark"],
    default: "light",
  },
  hashValue: String,
  randomValue: String,
  created: {
    type: Date,
    default: Date.now,
    required: true,
  },
  updated: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

userSchema.methods.setPassword = function(password) {
  this.randomValue = crypto.randomBytes(16).toString("hex");
  this.hashValue = crypto.pbkdf2Sync(password, this.randomValue, 1000, 64, "sha512").toString("hex");
};

userSchema.methods.checkPassword = function(password) {
  var hashValue = crypto.pbkdf2Sync(password, this.randomValue, 1000, 64, "sha512").toString("hex");
  return this.hashValue == hashValue;
};

userSchema.methods.generateToken = function() {
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);

  return jwt.sign({
      _id: this._id,
      email: this.email,
      expires: parseInt(expires.getTime() / 1000, 10),
    },
    process.env.JWT_SECRET,
    {
      algorithm: "HS512",
    },
  );
};

mongoose.model("User", userSchema, "Users");
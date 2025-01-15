const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Schema } = mongoose;
const { ROLES } = require("../constants/index");

const UserSchema = new Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String },
  googleId: { type: String, unique: true },
  role: {
    type: String,
    default: ROLES.User,
    enum: [ROLES.Admin, ROLES.User],
    required: true,
  },
  profile: {
    image: String,
    address: String,
    contactNumber: String,
    savedPaymentMethods: [String],
  },
  orderHistory: [{ type: Schema.Types.ObjectId, ref: "Order" }],
});

// Hash password before saving the user to the database
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to check if password is correct
UserSchema.methods.matchPassword = async function (enteredPassword) {
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  console.log("Password Match Result:", isMatch);
  return isMatch;
};

// Method to generate JWT
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE, // e.g., '1h' or '7d'
  });
};

module.exports = mongoose.model("User", UserSchema);

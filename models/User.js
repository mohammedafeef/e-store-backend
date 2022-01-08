const mongoose = require("mongoose");
const validator = require("validator");
const authHelper = require("../utils/authHelper");

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Email already exists"],
      lowercase: [true, "Email should be in lowercase"],
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "Password should be atleast 6 characters"],
      select: false,
    },
  },
  { timestamps: true }
);
UserSchema.pre("save", async function (next) {
  // check the password if it is modified
  if (!this.isModified("password")) {
    return next();
  }

  // Hashing the password
  this.password = await authHelper.encryptPassword(this.password);
  next();
});

module.exports = mongoose.model("User", UserSchema);

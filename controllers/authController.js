const RouteError = require("../utils/RouteError");
const User = require("../models/User");
const authHelper = require("../utils/authHelper");
const jwt = require("jsonwebtoken");
require("dotenv/config");

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return next(
        new RouteError(400, "fail", "email and password are required"),
        req,
        res,
        next
      );
    const user = await User.findOne({ email }).select("+password");
    console.log(user);
    const valid = await authHelper.matchPassword(password, user.password);
    console.log(valid);
    if (!user || !(await authHelper.matchPassword(password, user.password))) {
      return next(
        new RouteError(401, "fail", "Email or Password is wrong"),
        req,
        res,
        next
      );
    }
    const token = await authHelper.createNewToken(user.id);
    user.password = undefined;
    res.status(200).json({ data: { ...user, token } });
  } catch (err) {
    next(err);
  }
};

exports.register = async (req, res, next) => {
  try {
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    user.password = undefined;
    res.status(201).json({ data: user });
  } catch (err) {
    next(err);
  }
};

exports.autheticateUser = async (req, res, next) => {
  try {
    //checking that is token is given or not
    if (!req.headers.token) {
      return next(
        new RouteError(
          401,
          "fail",
          "unautherized user, please login to get access"
        ),
        req,
        res,
        next
      );
    }
    //verify the jwt token and decoding data from that
    const userCredentials = await jwt.verify(
      req.headers.token,
      process.env.TOKEN_SECRET_KEY
    );
    console.log(userCredentials);
    const user = await User.findById(userCredentials);
    if (!user)
      return next(
        new RouteError(401, "fail", "This user no longer exist"),
        req,
        res,
        next
      );
    //injecting user details to the request
    req.user = userCredentials;
    //sending forward to the route function
    return next();
  } catch (err) {
    next(err);
  }
};

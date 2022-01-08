// importing jwt
const jwt = require("jsonwebtoken");
const crypto = require("crypto-js");

//configuaring env keys
require("dotenv/config");

//To create new token with new credentials
exports.createNewToken = async (userCredentials) => {
  //creating jwt token using given credentials
  const userToken = await jwt.sign(
    userCredentials,
    process.env.TOKEN_SECRET_KEY
  );

  return userToken;
};
//encrypting password
exports.encryptPassword = (password) => {
  const encryptedPassword = crypto.AES.encrypt(
    password,
    process.env.PASS_SECRET_KEY
  ).toString();
  return encryptedPassword;
};
//decrypting password
exports.decryptPassword = async (hash) => {
  const password = await crypto.AES.decrypt(
    hash,
    process.env.PASS_SECRET_KEY
  ).toString(crypto.enc.Utf8);
  return password;
};

//check password matches or not
exports.matchPassword = async (password, hash) => {
  const decryptedPassword = await exports.decryptPassword(hash);
  return decryptedPassword === password;
};

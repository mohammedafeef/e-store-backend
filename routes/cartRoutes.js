const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authController = require("../controllers/authController");

//authenticate user
router.use(authController.autheticateUser);
//get cart
router.get("/", cartController.getCart);
//add product to cart
router.post("/", cartController.addToCart);
//remove product from cart
router.delete("/", cartController.removeFromCart);

module.exports = router;

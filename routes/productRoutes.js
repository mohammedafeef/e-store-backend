const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController")

//get products
router.get("/", productController.getProducts);
//add new product 
router.post("/", productController.addProduct);

module.exports = router;
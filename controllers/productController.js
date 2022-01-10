const Product = require("../models/Product");
const RouteError = require("../utils/RouteError");

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().select("-__v");
    res.status(200).json({ data: products });
  } catch (err) {
    next(err);
  }
};

exports.addProduct = async (req, res, next) => {
  try {
    const { name, price, description, imageUrl, quandity } = req.body;
    if (!name || !price || !description || !imageUrl || !quandity)
      return next(
        new RouteError(400, "fail", "required fields are missing"),
        req,
        res,
        next
      );
    const product = await Product.create({
      name,
      price,
      description,
      imageUrl,
      quandity,
    });
    res.status(201).json({ data: product });
  } catch (err) {
    next(err);
  }
};

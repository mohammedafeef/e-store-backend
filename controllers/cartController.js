const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.getCart = async (req, res, next) => {
  try {
    const userId = req.user;
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      const newCart = await Cart.create({
        userId,
        products: [],
      });
      return res.status(201).json({ data: newCart.products });
    }
    return res.status(200).json({ data: cart.products });
  } catch (err) {
    next(err);
  }
};
exports.addToCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    if (!productId)
      return next(
        new RouteError(400, "fail", "productId name are required"),
        req,
        res,
        next
      );
    let item = await Product.findById(productId);
    if (!item?.quandity > 0)
      return next(
        new RouteError(400, "fail", "product not available"),
        req,
        res,
        next
      );
    const userId = req.user;

    let cart = await Cart.findOne({ userId });
    if (cart) {
      //cart exists for user
      let itemIndex = cart.products.findIndex((p) => p.productId == productId);

      if (itemIndex > -1) {
        //product exists in the cart, update the quantity
        let productItem = cart.products[itemIndex];
        productItem.quantity += 1;
        cart.products[itemIndex] = productItem;
      } else {
        //product does not exists in cart, add new item
        cart.products.push({
          productId,
          quantity: 1,
          name: item.name,
          description: item.description,
          price: item.price,
          imageUrl: item.imageUrl,
        });
      }
      item.quandity -= 1;
      cart = await cart.save();
      await item.save();
      return res.status(201).json({ data: cart.products });
    } else {
      //no cart for user, create new cart
      const newCart = await Cart.create({
        userId,
        products: [
          {
            productId,
            quantity: 1,
            name: item.name,
            description: item.description,
            price: item.price,
            imageUrl: item.imageUrl,
          },
        ],
      });
      item.quandity -= 1;
      await item.save();
      return res.status(201).json({ data: newCart.products });
    }
  } catch (err) {
    next(err);
  }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    if (!productId)
      return next(
        new RouteError(400, "fail", "productId is required"),
        req,
        res,
        next
      );
    let item = await Product.findById(productId);
    if (!item)
      return next(
        new RouteError(400, "fail", "product not found"),
        req,
        res,
        next
      );

    const userId = req.user;

    let cart = await Cart.findOne({ userId });
    if (cart) {
      //cart exists for user
      let itemIndex = cart.products.findIndex((p) => p.productId == productId);

      if (itemIndex > -1) {
        //product exists in the cart, update the quantity

        if (cart.products[itemIndex].quantity > 1) {
          let productItem = cart.products[itemIndex];
          productItem.quantity -= 1;
          cart.products[itemIndex] = productItem;
        } else {
          cart.products.splice(itemIndex, 1);
        }
      }
      item.quandity += 1;
      cart = await cart.save();
      await item.save();
      return res.status(201).json({ data: cart.products });
    } else {
      //no cart for user, create new cart
      return next(
        new RouteError(400, "fail", "cart not exists for user"),
        req,
        res,
        next
      );
    }
  } catch (err) {
    next(err);
  }
};

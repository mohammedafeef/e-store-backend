const Cart = require("../models/Cart");

exports.getCart = async (req, res, next) => {
  try {
    const userId = req.user;
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return next(
        new RouteError(400, "fail", "cart not exists for user"),
        req,
        res,
        next
      );
    }
    return res.status(200).json({ data: { cart } });
  } catch (err) {
    next(err);
  }
};
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, price, name, imageUrl } = req.body;
    if (!productId || !price || !name || !imageUrl)
      return next(
        new RouteError(
          400,
          "fail",
          "productId, quantity, price, name are required"
        ),
        req,
        res,
        next
      );
    const userId = req.user;

    let cart = await Cart.findOne({ userId });
    console.log(cart);
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
        cart.products.push({ productId, quantity: 1, name, price, imageUrl });
      }
      cart = await cart.save();
      return res.status(201).json({ data: { cart } });
    } else {
      //no cart for user, create new cart
      const newCart = await Cart.create({
        userId,
        products: [{ productId, quantity: 1, name, price, imageUrl }],
      });

      return res.status(201).json({ data: { newCart } });
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
          cart.products.slice(itemIndex, 1);
        }
      }
      cart = await cart.save();
      return res.status(201).json({ data: { cart } });
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

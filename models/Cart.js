const mongoose = require("mongoose");

const CartSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: Number,
        name: String,
        price: Number,
        imageUrl: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);

const Cart = require("../models/Cart");

const CartController = {
  /* get all carts (only admin) */
  async get_carts(req, res) {
    try {
      const carts = await Cart.find();
      res.status(200).json({
        type: "success",
        carts,
      });
    } catch (err) {
      res.status(500).json({
        type: "error",
        message: "Something went wrong please try again",
        err,
      });
    }
  },

  /* get user cart */
  async get_cart(req, res) {
    try {
      const cart = await Cart.findOne({ userId: req.params.userId });
      if (!cart) {
        res.status(404).json({
          type: "error",
          message: "User doesn't exists",
        });
      } else {
        res.status(200).json({
          type: "success",
          cart,
        });
      }
    } catch (err) {
      res.status(500).json({
        type: "error",
        message: "Something went wrong please try again",
        err,
      });
    }
  },

  /* add product to cart */
  async create_cart(req, res) {
    const { userId, products } = req.body;

    try {
      // Check if a cart with the specified userId already exists
      let existingCart = await Cart.findOne({ userId });

      if (existingCart) {
        // If a cart exists, update the products by merging the existing and new products
        existingCart.products = [...existingCart.products, ...products];
        const updatedCart = await existingCart.save();

        res.status(200).json({
          type: "success",
          message: "Cart updated successfully",
          updatedCart,
        });
      } else {
        // If a cart doesn't exist, create a new one
        const newCart = new Cart({ userId, products });
        const savedCart = await newCart.save();

        res.status(201).json({
          type: "success",
          message: "Cart created successfully",
          savedCart,
        });
      }
    } catch (err) {
      res.status(500).json({
        type: "error",
        message: "Something went wrong, please try again",
        err,
      });
    }
  },

  /* update product */
  async update_cart(req, res) {
    try {
      const updatedCart = await Cart.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json({
        type: "success",
        message: "Cart updated successfully",
        updatedCart,
      });
    } catch (err) {
      res.status(500).json({
        type: "error",
        message: "Something went wrong please try again",
        err,
      });
    }
  },

  /* delete cart */
  async delete_cart(req, res) {
    try {
      await Cart.findOneAndDelete(req.params.id);
      res.status(200).json({
        type: "success",
        message: "Product has been deleted successfully",
      });
    } catch (err) {
      res.status(500).json({
        type: "error",
        message: "Something went wrong please try again",
        err,
      });
    }
  },
};

module.exports = CartController;

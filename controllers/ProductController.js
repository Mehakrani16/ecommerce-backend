const Product = require("../models/Product");
const mongoose = require("mongoose");

const ProductController = {
  /* get all products */
  async get_products(req, res) {
    const qNew = req.query.new;
    const qCategory = req.query.category;

    try {
      let products;

      if (qNew) {
        products = await Product.find().sort({ createdAt: -1 }).limit(5);
      } else if (qCategory) {
        products = await Product.find({
          categories: {
            $in: [qCategory],
          },
        });
      } else {
        products = await Product.find();
      }
      res.status(200).json({
        type: "success",
        products,
      });
    } catch (err) {
      res.status(500).json({
        type: "error",
        message: "Something went wrong please try again",
        err,
      });
    }
  },

  /* get single product */
  async get_product(req, res) {
    try {
      const productId = req.params.id;

      let product;
      try {
        // Check if the provided id is a valid ObjectId
        if (mongoose.isValidObjectId(productId)) {
          product = await Product.findOne({ _id: productId });
        } else {
          // If not a valid ObjectId, check using the custom id field
          product = await Product.findOne({ id: productId });
        }
      } catch (error) {
        console.error(error);
      }

      if (!product) {
        return res.status(404).json({
          type: "error",
          message: "Product not found",
        });
      }

      res.status(200).json({
        type: "success",
        product,
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({
        type: "error",
        message: "Something went wrong, please try again",
        error,
      });
    }
  },

  /* create new product */
  async create_product(req, res) {
    const newProduct = new Product(req.body);
    try {
      const savedProduct = await newProduct.save();
      res.status(201).json({
        type: "success",
        message: "Product created successfully",
        savedProduct,
      });
    } catch (err) {
      res.status(500).json({
        type: "error",
        message: "Something went wrong please try again",
        err,
      });
    }
  },

  /* update product */
  async update_product(req, res) {
    const existing = await Product.findById(req.params.id);
    if (!existing) {
      res.status(404).json({
        type: "error",
        message: "Product doesn't exists",
      });
    } else {
      try {
        const updatedProduct = await Product.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json({
          type: "success",
          message: "Product updated successfully",
          updatedProduct,
        });
      } catch (err) {
        res.status(500).json({
          type: "error",
          message: "Something went wrong please try again",
          err,
        });
      }
    }
  },

  /* delete product */
  async delete_user(req, res) {
    const existing = await Product.findById(req.params.id);
    if (!existing) {
      res.status(200).json({
        type: "error",
        message: "Product doesn't exists",
      });
    } else {
      try {
        await Product.findOneAndDelete(req.params.id);
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
    }
  },
};

module.exports = ProductController;
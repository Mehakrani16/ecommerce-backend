const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discountPercentage: {
      type: Number,
    },
    rating: {
      type: Number,
    },
    stock: {
      type: Number,
    },
    brand: {
      type: String,
    },
    category: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    images: {
      type: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);

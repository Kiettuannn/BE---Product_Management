const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  discountPercentage: Number,
  stock: Number,
  thumbnail: String,
  status: String,
  position: Number,
  deleted: Boolean,
  deleteAt: Date
});

// Third Parameter is name table database
const Product = mongoose.model("Product", productSchema, "product");

module.exports = Product;
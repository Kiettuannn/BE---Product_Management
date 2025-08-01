const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const productSchema = new mongoose.Schema({
  productCategoryId: String,
  title: String,
  description: String,
  price: Number,
  discountPercentage: Number,
  stock: Number,
  thumbnail: String,
  status: String,
  position: Number,
  slug: {
    type: String,
    slug: "title", // Automatically generate slug from title: ex: "product-1",
    unique: true,
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
}, {
  timestamps: true
});

// Third Parameter is name table database
const Product = mongoose.model("Product", productSchema, "product");

module.exports = Product;
const express = require("express");
const multer = require('multer')
const router = express.Router();
// Upload configuration using multer
const upload = multer();

const controller = require("../../controllers/admin/product-category_controller");
const validate = require("../../validates/admin/product.validate");

// Middleware for handling file uploads to Cloudinary
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

// Define routes for product management
router.get("/", controller.index);

router.get("/create", controller.create);
router.post("/create", upload.single('thumbnail'), uploadCloud.upload, validate.createPost, controller.createPost);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.get("/edit/:id", controller.edit);
router.patch("/edit/:id", upload.single('thumbnail'), uploadCloud.upload, validate.editPost, controller.editPatch);
module.exports = router;
const express = require("express");
const multer = require('multer')
const router = express.Router();

// Upload configuration using multer
const upload = multer();

const controller = require("../../controllers/admin/product_controller")
const validate = require("../../validates/admin/product.validate");

// Middleware for handling file uploads to Cloudinary
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");


// Define routes for product management
router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteItem);

router.get("/create", controller.create);

router.post("/create", upload.single('thumbnail'), uploadCloud.upload, validate.createPost, controller.createPost);

router.get("/edit/:id", controller.edit);
router.patch("/edit/:id", upload.single('thumbnail'), uploadCloud.upload, validate.createPost, controller.editPatch);

router.get("/detail/:id", controller.detail);

module.exports = router;
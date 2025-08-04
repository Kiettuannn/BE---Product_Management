const express = require("express");
const multer = require('multer')
const router = express.Router();

// Upload configuration using multer
const upload = multer();

const controller = require("../../controllers/admin/account_controller")


// Middleware for handling file uploads to Cloudinary
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create", upload.single('avatar'), uploadCloud.upload, controller.createPost)

module.exports = router;
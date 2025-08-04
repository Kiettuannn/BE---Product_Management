const express = require("express");
const router = express.Router();
const validate = require("../../validates/admin/role.validate.js")

// Upload configuration using multer

const controller = require("../../controllers/admin/role_controller.js")
router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create", validate.createPost, controller.createPost);

// Permission route
router.get("/permissions", controller.permissions);
router.patch("/permissions", controller.permissionsPatch);
module.exports = router;
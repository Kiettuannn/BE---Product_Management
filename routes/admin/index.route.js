const dashboardRoutes = require("./dashboard.route");
const productRoutes = require("./product.route");
const productCategoryRoutes = require("./product-category.route");
const roleRoutes = require("./role.route");
const accountRoutes = require("./account.route");
const authRoutes = require("./auth.route");
const PATH_ADMIN = require("../../config/system");

const authMiddleware = require("../../middlewares/admin/auth.middleware");

module.exports = (app) => {
  app.use(`${PATH_ADMIN.prefixAdmin}/dashboard`, authMiddleware.requireAuth, dashboardRoutes);
  app.use(`${PATH_ADMIN.prefixAdmin}/products`, authMiddleware.requireAuth, productRoutes);
  app.use(`${PATH_ADMIN.prefixAdmin}/product-category`, authMiddleware.requireAuth, productCategoryRoutes);
  app.use(`${PATH_ADMIN.prefixAdmin}/roles`, authMiddleware.requireAuth, roleRoutes);
  app.use(`${PATH_ADMIN.prefixAdmin}/accounts`, authMiddleware.requireAuth, accountRoutes);
  app.use(`${PATH_ADMIN.prefixAdmin}/auth`, authRoutes);
}
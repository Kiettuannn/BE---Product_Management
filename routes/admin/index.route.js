const dashboardRoutes = require("./dashboard.route");
const productRoutes = require("./product.route");
const productCategoryRoutes = require("./product-category.route");
const PATH_ADMIN = require("../../config/system");

module.exports = (app) => {
  app.use(`${PATH_ADMIN.prefixAdmin}/dashboard`, dashboardRoutes);
  app.use(`${PATH_ADMIN.prefixAdmin}/products`, productRoutes);
  app.use(`${PATH_ADMIN.prefixAdmin}/product-category`, productCategoryRoutes);
}
const dashboardRoutes = require("./dashboard.route");
const PATH_ADMIN = require("../../config/system");

module.exports = (app) => {
  app.use(`${PATH_ADMIN.prefixAdmin}/dashboard`,dashboardRoutes);
}
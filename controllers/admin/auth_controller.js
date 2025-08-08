const Account = require("../../models/account.model");
const bcrypt = require('bcryptjs');
const systemConfig = require("../../config/system");

// [GET] /admin/auth/login
module.exports.login = (req, res) => {
  if (req.cookies.token) {
    return res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
  }
  res.render("admin/pages/auth/login", {
    pageTitle: "Trang đăng nhập"
  });
}

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {

  const email = req.body.email;
  const password = req.body.password;

  const user = await Account.findOne({
    email: email,
    deleted: false
  });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    req.flash("error", "Email hoặc mật khẩu không chính xác");
    return res.redirect("back");
  }

  if (user.status == "inactive") {
    req.flash("error", "Tài khoản đã bị khóa");
    return res.redirect("back");
  }
  req.flash("success", "Đăng nhập thành công");
  res.cookie("token", user.token);

  res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
}

// [GET] /admin/auth/logout
module.exports.logout = (req, res) => {
  res.clearCookie("token");
  req.flash("success", "Đăng xuất thành công");
  res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
}
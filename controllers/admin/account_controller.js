const Role = require("../../models/role.model");
const Account = require("../../models/account.model");
const bcrypt = require('bcryptjs');
const systemConfig = require("../../config/system");


// [GET] /admin/accounts
module.exports.index = async (req, res) => {
  // GET account data
  const accounts = await Account.find({
    deleted: false
  }).select("-password -token");


  // Get title of an account' role
  for (const account of accounts) {
    const role = await Role.findOne({
      _id: account.role_id,
      deleted: false
    });
    if (role) {
      account.role = role
    }
  }

  res.render("admin/pages/accounts/index", {
    pageTitle: "Trang danh sách tài khoản",
    accounts: accounts,
  });
}

// [GET] /admin/accounts/create 
module.exports.create = async (req, res) => {

  // GET role Data for select
  const roles = await Role.find({
    deleted: false
  });

  res.render("admin/pages/accounts/create", {
    pageTitle: "Tạo tài khoản",
    roles: roles
  });
}

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  try {
    // Check existing email
    const existEmail = await Account.findOne({
      deleted: false,
      email: req.body.email
    });

    if (existEmail) {
      req.flash("error", "Email đã tồn tại");
      return res.redirect("back")
    }

    // Check existing role_id
    if (req.body.role_id) {
      const existRole_id = await Role.findOne({
        deleted: false,
        _id: req.body.role_id
      });
      if (!existRole_id) {
        req.flash("error", "Vai trò không tồn tại");
        return res.redirect("back");
      }
    }

    // Password Encryption 
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      req.body.password = hashedPassword;
    }
    // Save to database
    const account = new Account(req.body);
    await account.save();
    console.log(req.body)


    req.flash("success", "Tạo tài khoản thành công");
  } catch (error) {
    req.flash("error", "Lỗi tạo tài khoản");
  }
  res.redirect(`${systemConfig.prefixAdmin}/accounts`);

}
// [GET] /admin/accounts
module.exports.index = (req, res) => {
  res.render("admin/pages/accounts/index", {
    pageTitle: "Trang danh sách tài khoản"
  });
}

// [GET] /admin/accounts/create 
module.exports.create = (req, res) => {
  res.render("admin/pages/accounts/create", {
    pageTitle: "Tạo tài khoản"
  });
}
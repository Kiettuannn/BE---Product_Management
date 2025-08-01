const Role = require("../../models/role.model");

const systemConfig = require("../../config/system");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
  let find = {
    deleted: false
  }
  const roles = await Role.find(find);
  console.log(roles)
  res.render("admin/pages/roles/index", {
    pageTitle: "Trang nhóm quyền",
    roles: roles
  });
}

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/roles/create", {
    pageTitle: "Tạo nhóm quyền",
  })
}

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
  console.log("req.body", req.body);

  if (req.body) {
    const role = new Role(req.body)
    await role.save();
  }


  res.redirect(`${systemConfig.prefixAdmin}/roles`)
}
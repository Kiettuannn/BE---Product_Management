const Role = require("../../models/role.model");

const systemConfig = require("../../config/system");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
  let find = {
    deleted: false
  }
  const roles = await Role.find(find);
  // console.log(roles)
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


// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
  const roles = await Role.find({
    deleted: false
  })

  res.render("admin/pages/roles/permissions", {
    pageTitle: "Phân quyền",
    roles: roles
  })
}

// [PATCH] /admin/role/permissions
module.exports.permissionsPatch = async (req, res) => {
  try {
    const permissions = JSON.parse(req.body.permissions);
    if (!permissions) {
      return res.redirect("back")
      req.flash("error", "Cập nhập quyền thất bại")
    }
    for (const item of permissions) {
      const id = item.id;
      const permissions = item.permissions;
      await Role.updateOne({
        _id: id,
      }, {
        permissions: permissions
      });
    }
    req.flash("success", "Cập nhập quyền thành công")
    res.redirect("back")
  } catch (error) {
    req.flash("error", "Cập nhập quyền thất bại")
  }
}
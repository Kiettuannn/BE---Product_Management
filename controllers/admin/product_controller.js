const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");

// [GET] /admin/products
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query);

  let find = {
    deleted: false,
  };
  if (req.query.status) {
    find.status = req.query.status;
  }

  // Search
  const objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  // Pagination
  const countProducts = await Product.collection.count(find);
  let objectPagination = paginationHelper({
      currentPage: 1,
      limitItem: 3,
    },
    req.query,
    countProducts
  );

  const products = await Product.find(find)
    .sort({
      position: "asc"
    })
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip);

  res.render("admin/pages/products/index", {
    pageTitle: "Trang san pham",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const id = req.params.id;
  const status = req.params.status;

  await Product.updateOne({
    _id: id
  }, {
    status: status
  });
  req.flash("success", "Update status successfully");
  res.redirect("back");
};

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  switch (type) {
    case "active":
      await Product.updateMany({
        _id: {
          $in: ids
        }
      }, {
        status: "active"
      });
      req.flash("success", `Update ${ids.length} products successfully`);
      break;
    case "inactive":
      await Product.updateMany({
        _id: {
          $in: ids
        }
      }, {
        status: "inactive"
      });
      req.flash("success", `Update ${ids.length} products successfully`);
      break;
    case "delete-all":
      // Su dung updateMany thay vi deleteMany la de phuc vu cho viec xoa mem
      await Product.updateMany({
        _id: {
          $in: ids
        }
      }, {
        deleted: true,
        deleteAt: new Date(),
      });
      req.flash("success", `Deleted ${ids.length} products successfully`);
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await Product.updateOne({
          _id: id
        }, {
          position: position
        });
      }
      break;
    default:
      break;
  }
  res.redirect("back");
};

// [DELETEE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  // Xoa vinh vien
  // await Product.deleteOne({_id: id});

  // Xoa mem
  await Product.updateOne({
    _id: id
  }, {
    deleted: true,
    deleteAt: new Date(),
  });
  req.flash("success", "Deleted successfully");

  res.redirect("back");
};

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/products/create", {
    pageTitle: "Them moi san pham"
  })
}

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  // console.log(req.file);
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if (req.body.position == "") {
    countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  req.body.thumbnail = `uploads/${req.file.filename}`;

  const product = new Product(req.body);
  await product.save();
  res.redirect(`${systemConfig.prefixAdmin}/products`);
};
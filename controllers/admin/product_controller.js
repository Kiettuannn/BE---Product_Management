const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");

const ProductCategory = require("../../models/product-category.model");

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

  // Sort
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    // If sortKey and sortValue are provided, use them for sorting
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    // Default sort by position in descending order
    sort.position = "desc";
  }
  // End Sort

  const products = await Product.find(find)
    .sort(sort)
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
  try {
    const productCategories = await ProductCategory.find({
      deleted: false
    })
    if (!productCategories) {
      console.log("Cannot fount product Categories", error)
    }

    const newProductCategories = createTreeHelper.tree(productCategories);

    res.render("admin/pages/products/create", {
      pageTitle: "Them moi san pham",
      newProductCategories: newProductCategories
    });
  } catch (error) {
    req.flash("error", "Cannot create a product");
    res.redirect("back");
  }
};

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {

  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if (req.body.position == "") {
    countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }


  // console.log(req.body);
  const product = new Product(req.body);
  await product.save();
  res.redirect(`${systemConfig.prefixAdmin}/products`);
};

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    };

    const product = await Product.findOne(find);

    const productCategories = await ProductCategory.find({
      deleted: false
    });
    const newProductCategories = createTreeHelper.tree(productCategories)
    console.log(newProductCategories)

    res.render("admin/pages/products/edit", {
      pageTitle: "Chinh sua san pham",
      product: product,
      newProductCategories: newProductCategories
    })
  } catch (error) {
    console.log(error);
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
}

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);

  try {
    await Product.updateOne({
      _id: req.params.id
    }, {
      $set: req.body
    });
    req.flash("success", "Update product successfully");
  } catch (error) {
    req.flash("error", "Update product failed");
  }
  res.redirect("back");
}

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    }
    const product = await Product.findOne(find);
    res.render("admin/pages/products/detail", {
      pageTitle: "Chi tiet san pham",
      product: product
    });

  } catch (error) {
    console.log(error);
    req.flash("error", "Product not found");
    return res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
}
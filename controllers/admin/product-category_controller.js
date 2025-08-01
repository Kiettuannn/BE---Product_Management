const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus");
const paginationHelper = require("../../helpers/pagination");
const searchHelper = require("../../helpers/search");
const createTreeHelper = require("../../helpers/createTree");
// [GET] /admin/product-category
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query);

  const find = {
    deleted: false
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
  const countProductCategory = await ProductCategory.collection.count(find);
  let objectPagination = paginationHelper({
      currentPage: 1,
      limitItem: 6,
    },
    req.query,
    countProductCategory
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

  const productCategories = await ProductCategory.find(find)
    .sort(sort)
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip);


  const newProductCategories = createTreeHelper.tree(productCategories);
  res.render("admin/pages/product-category/index", {
    pageTitle: "Trang danh muc san pham",
    productCategories: newProductCategories,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
}

// [GET] /admin/product-category/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  }


  const productCategories = await ProductCategory.find(find);

  const newProductCategories = createTreeHelper.tree(productCategories);
  res.render("admin/pages/product-category/create", {
    pageTitle: "Tao moi danh muc san pham",
    productCategories: newProductCategories,
  });
}

// [POST] /admin/product-category/create
module.exports.createPost = async (req, res) => {
  // console.log("Creating product category:", req.body);

  if (req.body.position == "") {
    countProducts = await ProductCategory.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  const product = new ProductCategory(req.body);
  await product.save();
  res.redirect(`${systemConfig.prefixAdmin}/product-category`);
}


// [PATCH] /admin/product-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const id = req.params.id;
  const status = req.params.status;

  await ProductCategory.updateOne({
    _id: id
  }, {
    status: status
  });
  req.flash("success", "Update status successfully");
  res.redirect("back");
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  // console.log("Changing multiple product categories:", req.body);
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  switch (type) {
    case "active":
      await ProductCategory.updateMany({
        _id: {
          $in: ids
        }
      }, {
        status: "active"
      });
      req.flash("success", `Update ${ids.length} product categories successfully`);
      break;
    case "inactive":
      await ProductCategory.updateMany({
        _id: {
          $in: ids
        }
      }, {
        status: "inactive"
      });
      req.flash("success", `Update ${ids.length} product categories successfully`);
      break;
    case "delete-all":
      await ProductCategory.updateMany({
        _id: {
          $in: ids
        }
      }, {
        deleted: true
      });
      req.flash("success", `Delete ${ids.length} product categories successfully`);
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await ProductCategory.updateOne({
          _id: id
        }, {
          position: position
        });
      }
      req.flash("success", `Change position of ${ids.length} product categories successfully`);
      break;
  }
  res.redirect("back");
}

// [GET] /admin/product-category/edit/:id
module.exports.edit = async (req, res) => {
  const id = req.params.id;
  try {

    const productCategory = await ProductCategory.findOne({
      _id: id,
      deleted: false
    });

    const productCategories = await ProductCategory.find({
      deleted: false
    });

    // Create product-category tree
    const newProductCategories = createTreeHelper.tree(productCategories);

    res.render("admin/pages/product-category/edit", {
      pageTitle: "Chinh sua danh muc san pham",
      productCategory: productCategory,
      newProductCategories: newProductCategories
    });

  } catch (error) {
    req.flash("error", "Cannot edit this product-category", error);
    res.redirect("back");
  }

}
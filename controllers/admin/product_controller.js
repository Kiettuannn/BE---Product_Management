const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

// [GET] /admin/products
module.exports.index = async (req,res) => {

  const filterStatus = filterStatusHelper(req.query);

  let find = {
    deleted: false,
  };
  if(req.query.status){
    find.status = req.query.status;
  }


  // Search
  const objectSearch = searchHelper(req.query);
  if(objectSearch.regex){
    find.title = objectSearch.regex;
  }

  // Pagination
  const countProducts = await Product.collection.count(find);
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItem: 2
    },
    req.query,
    countProducts
  );


  const products = await Product.find(find).limit(objectPagination.limitItem).skip(objectPagination.skip);
  res.render("admin/pages/products/index",{
    pageTitle: "Trang san pham",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination
  });
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req,res) => {
  const id = req.params.id;
  const status = req.params.status;

  await Product.updateOne({_id: id},{status: status});
  res.redirect("back");
}


// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req,res) => {
  console.log(req.body);
  res.send("oke");
}
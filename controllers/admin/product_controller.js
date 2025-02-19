const Product = require("../../models/product.model");


// [GET] /admin/products
module.exports.index = async (req,res) => {

  let filterStatus = [
    {
      name: "Tat ca",
      status: "",
      class: ""
    },
    {
      name: "Hoat dong",
      status: "active",
      class: ""
    },
    {
      name: "Dung hoat dong",
      status: "inactive",
      class: ""
    },
  ];

  if(req.query.status){
    const index = filterStatus.findIndex(item => item.status == req.query.status)
    filterStatus[index].class = "active";
  }
  else{
    const index = filterStatus.findIndex(item => item.status == "")
    filterStatus[index].class = "active";
  }

  let find = {
    deleted: false,
  };
  if(req.query.status){
    find.status = req.query.status;
  }

  let keyword = "";
  if(req.query.keyword){
    keyword = req.query.keyword.replace(/\s+/g, "");
    const regex = new RegExp(keyword,"i");
    find.title = regex;
  }
  

  const products = await Product.find(find);


  res.render("admin/pages/products/index",{
    pageTitle: "Trang san pham",
    products: products,
    filterStatus: filterStatus,
    keyword: keyword
  });
}
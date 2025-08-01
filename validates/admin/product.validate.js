module.exports.createPost = (req, res, next) => {
  if (!req.body.title) {
    req.flash("error", "Title is required");
    return res.redirect("back"); // Back and return: return to the previous page and stop the execution of the below code
  }
  next();
}

module.exports.editPost = (req, res, next) => {
  if (!req.body.title) {
    req.flash("error", "Title is required");
    return res.redirect("back");
  }
  next();
}
let count = 0;
const createTree = (arr, parentId = "") => {
  const tree = [];
  arr.forEach((item) => {
    if (item.parentId === parentId) {
      count++;
      const newItem = item
      newItem.index = count;
      const children = createTree(arr, item.id);
      if (children.length > 0) {
        newItem.children = children;
      }
      tree.push(newItem);
    }
  });
  return tree;
}
module.exports.tree = (arr, parentId = "") => {
  count = 0; // Reset count for each new tree creation
  const tree = createTree(arr, parentId = "");
  return tree;
}
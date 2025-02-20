module.exports = (query) =>{
  let objectSearch = {
    keyword: ""
  }

  if(query.keyword){
    objectSearch.keyword = query.keyword;
    const deleteSpaceKW = query.keyword.replace(/\s+/g, "");
    objectSearch.regex = new RegExp(deleteSpaceKW,"i");
  }
  return objectSearch;
}
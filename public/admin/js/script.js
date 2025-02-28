// Button Status
const buttonStatus = document.querySelectorAll("[button-status]");
if(buttonStatus.length > 0){
  let url = new URL(window.location.href);

  buttonStatus.forEach(button => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status");

      if(status){
        url.searchParams.set("status",status);
      }
      else{
        url.searchParams.delete("status");
      }
      // console.log(url.href);

      // Redirect
      window.location.href = url.href;

    });
  });
};
// End Button Status


// Form search
const formSearch = document.querySelector("#form-search");
if(formSearch){
  let url = new URL(window.location.href);

  formSearch.addEventListener("submit",(e) => {
    e.preventDefault();
    const keyword = e.target.elements.keyword.value;
    if(keyword){
      url.searchParams.set("keyword",keyword);
    }
    else{
      url.searchParams.delete("keyword");
    }
    window.location.href = url.href;
  });
} 
// EndForm search 

// Pagination 
const buttonPagination = document.querySelectorAll("[button-pagination]");


if(buttonPagination.length > 0){
  let url = new URL(window.location.href);

  buttonPagination.forEach(button =>{
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination");
      if(page){
       url.searchParams.set("page",page);
      }
      window.location.href = url.href;
    });
  });
}
// End Pagination 
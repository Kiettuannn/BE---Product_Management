// Button Status
const buttonStatus = document.querySelectorAll("[button-status]");
if (buttonStatus.length > 0) {
  let url = new URL(window.location.href);

  buttonStatus.forEach(button => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status");

      if (status) {
        url.searchParams.set("status", status);
      } else {
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
if (formSearch) {
  let url = new URL(window.location.href);

  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    const keyword = e.target.elements.keyword.value;
    if (keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }
    window.location.href = url.href;
  });
}
// EndForm search 

// Pagination 
const buttonPagination = document.querySelectorAll("[button-pagination]");


if (buttonPagination.length > 0) {
  let url = new URL(window.location.href);

  buttonPagination.forEach(button => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination");
      if (page) {
        url.searchParams.set("page", page);
      }
      window.location.href = url.href;
    });
  });
}
// End Pagination 

// Checkbox multi 
const checkBoxMulti = document.querySelector("[checkbox-multi]");
if (checkBoxMulti) {
  const inputcheckAll = checkBoxMulti.querySelector("input[name='checkall']");
  const inputId = checkBoxMulti.querySelectorAll("input[name='id']");

  inputcheckAll.addEventListener("click", () => {
    if (inputcheckAll.checked) {
      inputId.forEach(input => {
        input.checked = true;
      })
    } else {
      inputId.forEach(input => {
        input.checked = false;
      })
    }
  });
  inputId.forEach(input => {
    input.addEventListener("click", () => {
      const countChecked = checkBoxMulti.querySelectorAll("input[name='id']:checked").length;

      if (countChecked == inputId.length) {
        inputcheckAll.checked = true;
      } else {
        inputcheckAll.checked = false;
      }
    })
  })
}
// End Checkbox multi 

// Form change multi 
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();
    const checkBoxMulti = document.querySelector("[checkbox-multi]");
    const inputsChecked = checkBoxMulti.querySelectorAll("input[name='id']");

    // Lay ra loai cua lua chon de ap dung

    const typeChange = e.target.elements.type.value; // type: la name cua select option
    if (typeChange == "delete-all") {
      const isConfirm = confirm("Ban co chac muon xoa khong ?");

      if (!isConfirm) {
        return;
      }
    }

    if (inputsChecked.length > 0) {
      let ids = [];
      const inputIds = formChangeMulti.querySelector("input[name='ids']");
      inputsChecked.forEach(input => {
        const id = input.value;

        if (typeChange == "change-position") {
          const position = input.closest("tr").querySelector("input[name='position']").value;
          ids.push(`${id}-${position}`);
        } else {
          ids.push(id);
        }
      })
      inputIds.value = ids.join(", ")

      formChangeMulti.submit();
    } else {
      alert("Chon it nhat 1 ban ghi");
    }
  });
};
// End Form change multi 


// Show alert
const showAlert = document.querySelector("[show-alert]")
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));
  const closeAlert = showAlert.querySelector("[close-alert]");

  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, (time));
  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  })
}
// End Show alert


// Upload Image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
  const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");

  uploadImageInput.addEventListener("change", (e) => {
    // console.log(e);
    const file = e.target.files[0];
    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file);
    }
  });
}
// End Upload Image

// Sort
const sort = document.querySelector("[sort]");
if (sort) {
  let url = new URL(window.location.href);
  const sortSelect = sort.querySelector("[sort-select]");
  const sortClear = sort.querySelector("[sort-clear]");

  // Set sortKey and sortValue 
  sortSelect.addEventListener("change", (e) => {
    const value = e.target.value;
    const [sortKey, sortValue] = value.split("-");

    url.searchParams.set("sortKey", sortKey);
    url.searchParams.set("sortValue", sortValue);

    window.location.href = url.href;
  });
  // End Set sortKey and sortValue

  // Clear sort
  sortClear.addEventListener("click", () => {
    url.searchParams.delete("sortKey");
    url.searchParams.delete("sortValue");
    window.location.href = url.href;
  });
  // End Clear sort

  // Add select option for sort
  const sortKey = url.searchParams.get("sortKey");
  const sortValue = url.searchParams.get("sortValue");

  if (sortKey && sortValue) {
    // Create a string to match the value format
    const stringSort = `${sortKey}-${sortValue}`;

    // Find the option with value equal to stringSort
    const optionSelected = sortSelect.querySelector(`option[value="${stringSort}"]`);
    if (optionSelected) {
      // Set the selected attribute to true for the matched option
      optionSelected.selected = true;
    }
  }
  // End Add select option for sort
}
// End sort
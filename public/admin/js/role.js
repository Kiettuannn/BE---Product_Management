// Permissions
const tablePermissions = document.querySelector("[table-permissions]");
if (tablePermissions) {
  const buttonSubmit = document.querySelector("[button-submit]");

  buttonSubmit.addEventListener("click", () => {
    let permissions = [];
    const rows = tablePermissions.querySelectorAll("[data-name]");

    rows.forEach((row) => {
      const name = row.getAttribute("data-name");
      const inputs = row.querySelectorAll("input");


      if (name == "id") {
        inputs.forEach((input) => {
          const id = input.value;
          permissions.push({
            id: id,
            permissions: []
          });
        })
      } else {
        inputs.forEach((input, index) => {
          const checked = input.checked;
          if (checked) {
            permissions[index].permissions.push(name)
          }
        })
      }
    })
    // console.log("permission", permissions);
    if (permissions.length > 0) {
      const formChangePermission = document.querySelector("#form-change-permissions");
      const inputPermissions = document.querySelector("input[name='permissions']");
      inputPermissions.value = JSON.stringify(permissions)
      formChangePermission.submit();
    }
  })
}
// End permissions


// Permissions Data Default
const dataRoles = document.querySelector("[data-roles]");
if (dataRoles) {
  // Convert to object
  const roles = JSON.parse(dataRoles.getAttribute("data-roles"));

  const tablePermissions = document.querySelector("[table-permissions]");

  roles.forEach((role, index) => {
    const permissions = role.permissions;

    permissions.forEach((pm) => {
      const row = tablePermissions.querySelector(`[data-name=${pm}]`);
      const input = row.querySelectorAll("input")[index];
      input.checked = true;
    })
  })
}
// End Permissions Data Default
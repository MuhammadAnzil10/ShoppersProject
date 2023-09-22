// category add validation

const names = document.getElementById("name");
const description = document.getElementById("description");
const errName = document.getElementById("errName");
const errDescription = document.getElementById("errDescription");
const form = document.getElementById("categoryForm");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (names.value.trim() === "") {
    errName.innerHTML = "Enter Valid Name";
    return;
  } else {
    errName.innerHTML = "";
  }
  if (description.value.trim() === "" || description.value.trim().length < 3) {
    errDescription.innerHTML = "Enter Valid Description";
    return;
  } else {
    errDescription.innerHTML = "";
  }

  form.submit();
});

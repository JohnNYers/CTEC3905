! function () {
  let mval = document.getElementById("dd-value");

  let dropdown = document.getElementById("dd").getElementsByTagName("ul")[0];
  let li = dropdown.getElementsByTagName("li");
  let selected = document.getElementsByClassName("dd-select")[0];
  mval.addEventListener("click", function () {
    dropdown.classList.toggle("active");
    mval.classList.toggle("active");
  });
  for (let i in li) {
    li[i].addEventListener("click", function () {
      selected.classList.remove("dd-select");
      li[i].classList.add("dd-select");
      mval.innerHTML = li[i].innerHTML;
      selected = li[i];
      dropdown.classList.remove("active");
      mval.classList.remove("active");
    });
  }

}();
! function switcher() {
  let switcher = document.getElementsByClassName("switcher")[0];
  switcher.addEventListener("click", function () {
    document.getElementById("diagram2d").classList.toggle("active");
    document.getElementById("diagram3d").classList.toggle("active");
    if (switcher.innerHTML === "2D") {
      switcher.innerHTML = "3D";
      
    } else {
      switcher.innerHTML = "2D";
    }
  });
}();
! function switcher() {
  let swapper = document.getElementsByClassName("switcher")[0];
  swapper.addEventListener("click", function () {
    document.getElementById("diagram2d").classList.toggle("active");
    document.getElementById("diagram3d").classList.toggle("active");
    if (swapper.innerHTML === "2D") {
      swapper.innerHTML = "3D";
      
    } else {
      swapper.innerHTML = "2D";
    }

  });
}();
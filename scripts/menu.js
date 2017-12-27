'use strict';
/**
* Creates the select menu behaviour.
*/
!function () {
  let mval = document.getElementById("dd-value");

  let dropdown = document.getElementById("dd").getElementsByTagName("ul")[0];
  let li = dropdown.getElementsByTagName("li");
  let selected = document.getElementsByClassName("dd-select")[0];
  mval.addEventListener("click", function () {
    dropdown.classList.toggle("active");
    mval.classList.toggle("active");
  });
  for (let i = 0; i < li.length; ++i) {
    li[i].addEventListener("click", function () {
      selected.classList.remove("dd-select");
      li[i].classList.add("dd-select");
      mval.innerHTML = li[i].innerHTML;
      selected = li[i];
      dropdown.classList.remove("active");
      mval.classList.remove("active");
      diagram3dhandler.index = i;
      diagram3dhandler.draw();
      diagram2dhandler.build(i);
    });
  }

}();

/**
* Creates the diagram changing behaviour.
*/
!function switcher() {
  let switcher = document.getElementsByClassName("switcher")[0];
  switcher.addEventListener("click", function () {
    document.getElementById("diagram2d").classList.toggle("active");
    document.getElementById("diagram3d").classList.toggle("active");
    if (switcher.innerHTML === "2D") {
      switcher.innerHTML = "3D";
      switcher.classList.remove("rightposition");
    } else {
      switcher.innerHTML = "2D";
      switcher.classList.add("rightposition");
    }
  });
}();
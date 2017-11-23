!function ()
{
  let menuicon = document.getElementById("mobile-menu-icon");
  let menu = document.getElementById("menu");
  menuicon.addEventListener("click", function () {
    menu.classList.toggle("active");
  });
} ();
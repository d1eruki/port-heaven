document.addEventListener("DOMContentLoaded", function () {
  const scrollIcon = document.querySelector("#scroll-to-top");
  if (!scrollIcon) return;

  scrollIcon.style.visibility = "hidden";
  scrollIcon.style.opacity = "0";
  scrollIcon.style.transition = "opacity 0.3s, visibility 0.3s";

  function toggleScrollButton() {
    if (window.scrollY > 300) {
      scrollIcon.style.visibility = "visible";
      scrollIcon.style.opacity = "1";
    } else {
      scrollIcon.style.visibility = "hidden";
      scrollIcon.style.opacity = "0";
    }
  }

  scrollIcon.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  toggleScrollButton();
  window.addEventListener("scroll", toggleScrollButton);
});

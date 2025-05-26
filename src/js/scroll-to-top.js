document.addEventListener("DOMContentLoaded", function () {
  const scrollIcon = document.querySelector("#scroll-to-top");
  if (!scrollIcon) return;

  function toggleScrollButton() {
    if (window.scrollY > 300) {
      scrollIcon.classList.add("visible");
    } else {
      scrollIcon.classList.remove("visible");
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

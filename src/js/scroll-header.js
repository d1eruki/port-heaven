export const updateHeaderOnScroll = () => {
  const headerScrolled = document.getElementById("header");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 25) {
      headerScrolled.classList.add("header-scrolled");
    } else {
      headerScrolled.classList.remove("header-scrolled");
    }
  });
};

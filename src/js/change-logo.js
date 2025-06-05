const headerLogo = document.getElementById("header-logo");
const startSection = document.getElementById("start");

function updateHeaderLogoText() {
  const SCROLL_OFFSET = document.querySelector("header").offsetHeight * 2;
  const scrollPos = window.scrollY + SCROLL_OFFSET;
  const sectionTop = startSection.offsetTop;
  const sectionBottom = sectionTop + startSection.offsetHeight;
  const isInView = scrollPos >= sectionTop && scrollPos < sectionBottom;

  const newText = isInView ? "dieruki" : "artem<br>tresckow";

  if (headerLogo.innerHTML !== newText) {
    headerLogo.style.opacity = 0;
    setTimeout(() => {
      headerLogo.innerHTML = newText;
      headerLogo.style.opacity = 1;
    }, 200);
  }
}

window.addEventListener("scroll", updateHeaderLogoText);
window.addEventListener("load", updateHeaderLogoText);

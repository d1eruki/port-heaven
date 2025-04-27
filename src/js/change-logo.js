const headerLogo = document.getElementById("header-logo");
const aboutSection = document.getElementById("about");

function updateHeaderLogoText() {
  const SCROLL_OFFSET = document.querySelector("header").offsetHeight * 2;
  const scrollPos = window.scrollY + SCROLL_OFFSET;
  const sectionTop = aboutSection.offsetTop;
  const sectionBottom = sectionTop + aboutSection.offsetHeight;
  const isInView = scrollPos >= sectionTop && scrollPos < sectionBottom;

  const newText = isInView ? "artem tresckow" : "dieruki";

  if (headerLogo.textContent !== newText) {
    headerLogo.style.opacity = 0;
    setTimeout(() => {
      headerLogo.textContent = newText;
      headerLogo.style.opacity = 1;
    }, 200);
  }
}

window.addEventListener("scroll", updateHeaderLogoText);
window.addEventListener("load", updateHeaderLogoText);

const header = document.querySelector("header");
const headerLinks = document.querySelectorAll("a[data-open-block]");
const sections = Array.from(headerLinks).map((link) => {
  const id = link.getAttribute("href");
  return document.querySelector(id);
});

let isScrolling = false;
let scrollTimeout;

function setActiveLink(targetLink) {
  headerLinks.forEach((link) => link.classList.remove("active"));
  targetLink.classList.add("active");
}

headerLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    const targetEl = document.querySelector(targetId);
    const SCROLL_OFFSET = header.offsetHeight * 2;

    if (targetEl) {
      const targetY = targetEl.offsetTop - SCROLL_OFFSET;

      setActiveLink(this);
      isScrolling = true;

      window.scrollTo({
        top: targetY,
        behavior: "smooth",
      });

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
        onScroll(); // Обновляем вручную
      }, 150);
    }
  });
});

function onScroll() {
  if (isScrolling) return;

  const SCROLL_OFFSET = header.offsetHeight * 2;
  const scrollPos = window.scrollY + SCROLL_OFFSET + 1;

  let current = sections[0];
  for (let i = 0; i < sections.length; i++) {
    const sectionTop = sections[i].offsetTop;
    if (scrollPos >= sectionTop) {
      current = sections[i];
    } else {
      break;
    }
  }

  const currentId = current.getAttribute("id");

  headerLinks.forEach((link) => {
    const href = link.getAttribute("href").replace("#", "");
    if (href === currentId) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

window.addEventListener("scroll", () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    isScrolling = false;
    onScroll();
  }, 150);
});

window.addEventListener("load", onScroll);

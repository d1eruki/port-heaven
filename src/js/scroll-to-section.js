const headerLinks = document.querySelectorAll("a[data-open-block]");
const sections = Array.from(headerLinks).map((link) => {
  const id = link.getAttribute("href");
  return document.querySelector(id);
});

let isScrolling = false;
const SCROLL_OFFSET = 80;

function setActiveLink(targetLink) {
  headerLinks.forEach((link) => link.classList.remove("active"));
  targetLink.classList.add("active");
}

headerLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    const targetEl = document.querySelector(targetId);

    if (targetEl) {
      const targetY = targetEl.offsetTop - SCROLL_OFFSET;

      setActiveLink(this);
      isScrolling = true;

      window.scrollTo({
        top: targetY,
        behavior: "smooth",
      });
    }
  });
});

function onScroll() {
  if (isScrolling) return;

  const scrollPos = window.scrollY + SCROLL_OFFSET;

  let current = null;

  // Если скролл меньше верхней границы первой секции — ничего не выделяем
  if (scrollPos < sections[0].offsetTop) {
    current = null;
  } else {
    for (let i = 0; i < sections.length; i++) {
      const sectionTop = sections[i].offsetTop;
      if (scrollPos >= sectionTop) {
        current = sections[i];
      } else {
        break;
      }
    }
  }

  headerLinks.forEach((link) => {
    const href = link.getAttribute("href").replace("#", "");
    if (current && href === current.getAttribute("id")) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

function handleScrollEnd() {
  if (isScrolling) {
    isScrolling = false;
    onScroll();
  }
}

if ("onscrollend" in window) {
  window.addEventListener("scrollend", handleScrollEnd);
} else {
  headerLinks.forEach((link) => {
    link.addEventListener("click", function () {
      setTimeout(() => {
        isScrolling = false;
        onScroll();
      }, 600);
    });
  });
}

window.addEventListener("scroll", () => {
  if (isScrolling && !("onscrollend" in window)) {
    const scrollTimeout = setTimeout(() => {
      isScrolling = false;
      onScroll();
    }, 100);
    window.addEventListener("scroll", () => clearTimeout(scrollTimeout), { once: true });
  }
  onScroll();
});

window.addEventListener("load", onScroll);

const header = document.querySelector("header");
const headerLinks = document.querySelectorAll("a[data-open-block]");
const sections = Array.from(headerLinks).map((link) => {
  const id = link.getAttribute("href");
  return document.querySelector(id);
});

let isScrolling = false;

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
    }
  });
});

function onScroll() {
  if (isScrolling) return;

  const SCROLL_OFFSET = header.offsetHeight * 2;
  const scrollPos = window.scrollY + SCROLL_OFFSET;

  let current = sections[0];

  if (scrollPos < sections[0].offsetTop) {
    current = sections[0];
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

const headerLinks = document.querySelectorAll("a[data-open-block]");
const sections = Array.from(headerLinks).map(link => {
  const id = link.getAttribute("href");
  return document.querySelector(id);
});

const SCROLL_OFFSET = 80;
let isScrolling = false;

function setActiveLink(targetLink) {
  headerLinks.forEach(link => link.classList.remove("active"));
  if (targetLink) targetLink.classList.add("active");
}

function onScroll() {
  if (isScrolling) return;

  const viewportMiddle = window.scrollY + window.innerHeight / 2;
  let currentSectionIndex = -1;

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (!section) continue;
    const sectionTop = section.offsetTop - SCROLL_OFFSET;
    const sectionBottom = sectionTop + section.offsetHeight;

    if (viewportMiddle >= sectionTop && viewportMiddle < sectionBottom) {
      currentSectionIndex = i;
      break;
    }
  }

  // Если не нашли секцию — определяем ближайшую
  if (currentSectionIndex === -1) {
    if (viewportMiddle < (sections[0]?.offsetTop ?? 0)) {
      currentSectionIndex = 0;
    } else if (viewportMiddle >= ((sections.at(-1)?.offsetTop ?? 0) + (sections.at(-1)?.offsetHeight ?? 0))) {
      currentSectionIndex = sections.length - 1;
    }
  }

  headerLinks.forEach((link, i) => {
    if (i === currentSectionIndex) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

headerLinks.forEach(link => {
  link.addEventListener("click", function(e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    const targetEl = document.querySelector(targetId);

    if (targetEl) {
      const targetY = targetEl.offsetTop - SCROLL_OFFSET;
      setActiveLink(this);
      isScrolling = true;
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }
  });
});

function handleScrollEnd() {
  if (isScrolling) {
    isScrolling = false;
    onScroll();
  }
}

if ("onscrollend" in window) {
  window.addEventListener("scrollend", handleScrollEnd);
} else {
  headerLinks.forEach(link => {
    link.addEventListener("click", function() {
      setTimeout(() => {
        isScrolling = false;
        onScroll();
      }, 600);
    });
  });
}

let scrollTimeout;
window.addEventListener("scroll", () => {
  if (isScrolling && !("onscrollend" in window)) {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
      onScroll();
    }, 100);
  }
  onScroll();
});

window.addEventListener("load", onScroll);

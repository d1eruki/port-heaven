import { getHeaderHeight } from "./global-variables";

document.addEventListener("DOMContentLoaded", function () {
  const scrollIcon = document.querySelector("#scroll-to-top, [data-scroll-to-top]");
  const headerLinks = document.querySelectorAll("a[data-open-block]");
  const sections = Array.from(headerLinks)
    .map((link) => {
      const id = link.getAttribute("href");
      if (!id || !id.startsWith("#")) return null;

      const cleanId = id.slice(1);
      return document.querySelector(`[data-section="${cleanId}"]`);
    })
    .filter(Boolean);

  function setActiveLinkByIndex(index) {
    headerLinks.forEach((link, i) => {
      link.classList.toggle("active", i === index);
    });
  }

  function updateActiveLink() {
    const scrollY = window.scrollY + getHeaderHeight() + 10;
    let lastMatchedIndex = -1;

    sections.forEach((section, i) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;

      if (scrollY >= top && scrollY < bottom) {
        lastMatchedIndex = i;
      }
    });

    if (lastMatchedIndex !== -1) {
      setActiveLinkByIndex(lastMatchedIndex);
    } else {
      headerLinks.forEach((link) => link.classList.remove("active"));
    }
  }

  function scrollToWithHeaderOffset(targetEl) {
    const targetY = targetEl.getBoundingClientRect().top + window.scrollY - getHeaderHeight();

    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
  }

  window.addEventListener("scroll", updateActiveLink);
  window.addEventListener("load", updateActiveLink);

  if (scrollIcon) {
    scrollIcon.style.display = "none";

    const style = document.createElement("style");
    style.textContent = `a[data-open-block] { transition: all 0.3s ease; }`;
    document.head.appendChild(style);

    function toggleScrollButton() {
      scrollIcon.style.display = window.scrollY > 300 ? "block" : "none";
    }

    scrollIcon.addEventListener("click", () => {
      document.documentElement.scrollIntoView({ behavior: "smooth" });
    });

    window.addEventListener("scroll", toggleScrollButton);
    toggleScrollButton();
  }

  headerLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").slice(1); // убираем #
      const targetEl = document.querySelector(`[data-section="${targetId}"]`);
      if (targetEl) scrollToWithHeaderOffset(targetEl);
    });
  });
});

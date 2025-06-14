document.addEventListener("DOMContentLoaded", function () {
  const scrollIcon = document.querySelector("#scroll-to-top");
  const headerLinks = document.querySelectorAll("a[data-open-block]");
  const sections = Array.from(headerLinks)
    .map((link) => {
      const id = link.getAttribute("href");
      if (!id || !id.startsWith("#")) return null;
      const section = document.querySelector(id);
      return section || null;
    })
    .filter(Boolean);

  if (!headerLinks.length || !sections.length) return;

  function setActiveLinkByIndex(index) {
    headerLinks.forEach((link, i) => {
      link.classList.toggle("active", i === index);
    });
  }

  function updateActiveLink() {
    const scrollY = window.scrollY + window.innerHeight / 3;
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
    }
  }

  function scrollToWithHeaderOffset(targetEl) {
    const header = document.querySelector("header");
    const headerHeight = header ? header.offsetHeight : 0;
    const targetY = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight;

    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
  }

  window.addEventListener("scroll", updateActiveLink);

  if (scrollIcon) {
    scrollIcon.style.display = "none"; // скрываем изначально

    function toggleScrollButton() {
      scrollIcon.style.display = window.scrollY > 300 ? "block" : "none";
    }

    scrollIcon.addEventListener("click", () => {
      document.documentElement.scrollIntoView({ behavior: "smooth" });
    });

    toggleScrollButton();
    window.addEventListener("scroll", toggleScrollButton);
  }

  headerLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        scrollToWithHeaderOffset(targetEl);
      }
    });
  });

  window.addEventListener("load", updateActiveLink);
});

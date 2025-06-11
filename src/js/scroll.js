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

  let isProgrammaticScroll = false; // Флаг для программного скролла

  function getBannerHeight() {
    const banner = document.getElementById("banner");
    return banner ? banner.offsetHeight : 0;
  }

  function setActiveLinkByIndex(index) {
    headerLinks.forEach((link, i) => {
      link.classList.toggle("active", i === index);
    });
  }

  function scrollToSection(section) {
    if (!section) return;
    isProgrammaticScroll = true; // Устанавливаем флаг
    const targetY = section.offsetTop - getBannerHeight();
    window.scrollTo({ top: targetY, behavior: "smooth" });

    // Сбрасываем флаг после завершения скролла
    window.addEventListener(
      "scrollend",
      () => {
        isProgrammaticScroll = false;
      },
      { once: true }
    );
  }

  // Подсветка активной ссылки при скролле
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    let currentIndex = 0;
    for (let i = 0; i < sections.length; i++) {
      if (scrollY >= sections[i].offsetTop - window.innerHeight / 2) {
        currentIndex = i;
      } else {
        break;
      }
    }
    setActiveLinkByIndex(currentIndex);
  });

  if (scrollIcon) {
    function toggleScrollButton() {
      if (window.scrollY > 300) {
        scrollIcon.classList.add("visible");
      } else {
        scrollIcon.classList.remove("visible");
      }
    }

    scrollIcon.addEventListener("click", function () {
      isProgrammaticScroll = true;
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.addEventListener(
        "scrollend",
        () => {
          isProgrammaticScroll = false;
        },
        { once: true }
      );
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
        scrollToSection(targetEl);
      }
    });
  });

  window.addEventListener("load", () => {
    const scrollY = window.scrollY;
    let currentIndex = 0;
    for (let i = 0; i < sections.length; i++) {
      if (scrollY >= sections[i].offsetTop - window.innerHeight / 2) {
        currentIndex = i;
      } else {
        break;
      }
    }
    setActiveLinkByIndex(currentIndex);
  });
});

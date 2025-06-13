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

  // Кнопка "наверх"
  if (scrollIcon) {
    function toggleScrollButton() {
      scrollIcon.classList.toggle("visible", window.scrollY > 300);
    }

    scrollIcon.addEventListener("click", () => {
      document.documentElement.scrollIntoView({ behavior: "smooth" });
    });

    toggleScrollButton();
    window.addEventListener("scroll", toggleScrollButton);
  }

  // Клик по якорным ссылкам
  headerLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Установить активный линк при загрузке страницы
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

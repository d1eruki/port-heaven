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
    console.log("Активный индекс:", index);
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

      console.log(`Секция #${i} — top: ${top}, bottom: ${bottom}`);

      if (scrollY >= top && scrollY < bottom) {
        lastMatchedIndex = i;
      }
    });

    if (lastMatchedIndex !== -1) {
      setActiveLinkByIndex(lastMatchedIndex);
    }

    console.log("Активный индекс:", lastMatchedIndex);
    console.log("Текущий scrollY + смещение:", scrollY);
  }

  // Подсветка активной ссылки при скролле
  window.addEventListener("scroll", updateActiveLink);

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
  window.addEventListener("load", updateActiveLink);
});

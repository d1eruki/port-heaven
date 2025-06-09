document.addEventListener("DOMContentLoaded", function () {
  // === Элементы ===
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

  const bannerElement = document.getElementById("banner");
  const bannerHeight = bannerElement ? bannerElement.offsetHeight : 0;

  // === Переменные состояния ===
  let lastScrollY = window.scrollY;
  let suppressAutoScroll = false;

  // === Вспомогательные функции ===
  function isMobileDevice() {
    const isMobileWidth = window.innerWidth <= 768;
    const userAgent = navigator.userAgent.toLowerCase();
    return isMobileWidth || /mobile|android|iphone|ipad|tablet/i.test(userAgent);
  }

  function setActiveLinkByIndex(index) {
    headerLinks.forEach((link, i) => {
      link.classList.toggle("active", i === index);
    });
  }

  function scrollToSection(section) {
    if (!section) return;
    suppressAutoScroll = true;

    const targetY = section.offsetTop - bannerHeight;
    window.scrollTo({ top: targetY, behavior: "smooth" });

    setTimeout(() => {
      suppressAutoScroll = false;
    }, 1000);
  }

  function getCurrentSectionIndex() {
    const scrollY = window.scrollY;
    let currentIndex = 0;

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      if (scrollY >= section.offsetTop - window.innerHeight / 2) {
        currentIndex = i;
      } else {
        break;
      }
    }
    return currentIndex;
  }

  // === Кнопка "вверх" ===
  if (scrollIcon) {
    function toggleScrollButton() {
      if (window.scrollY > 300) {
        scrollIcon.classList.add("visible");
      } else {
        scrollIcon.classList.remove("visible");
      }
    }

    scrollIcon.addEventListener("click", function () {
      suppressAutoScroll = true;
      window.scrollTo({ top: 0, behavior: "smooth" });

      setActiveLinkByIndex(0); // Устанавливаем активную первую ссылку

      setTimeout(() => {
        suppressAutoScroll = false;
      }, 1000);
    });

    toggleScrollButton();
    window.addEventListener("scroll", toggleScrollButton);
  }

  // === Автопереход при обычном скролле (только на десктопе) ===
  window.addEventListener("scroll", () => {
    if (suppressAutoScroll || isMobileDevice()) return;

    const currentScrollY = window.scrollY;
    const direction = currentScrollY > lastScrollY ? "down" : "up";
    lastScrollY = currentScrollY;

    const currentIndex = getCurrentSectionIndex();
    let targetIndex = currentIndex;
    const currentSection = sections[currentIndex];

    if (!currentSection) return;

    const sectionTop = currentSection.offsetTop;

    if (direction === "down" && currentIndex < sections.length - 1) {
      if (currentScrollY > sectionTop + 100) {
        targetIndex = currentIndex + 1;
      }
    } else if (direction === "up" && currentIndex > 0) {
      if (currentScrollY < sectionTop - 100) {
        targetIndex = currentIndex - 1;
      }
    }

    if (targetIndex !== currentIndex && sections[targetIndex]) {
      scrollToSection(sections[targetIndex]);
    }

    setActiveLinkByIndex(targetIndex);
  });

  // === Клики по ссылкам ===
  headerLinks.forEach((link, i) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        scrollToSection(targetEl);
        setActiveLinkByIndex(i);
      }
    });
  });

  // === Установка активной ссылки при загрузке ===
  window.addEventListener("load", () => {
    const currentIndex = getCurrentSectionIndex();
    setActiveLinkByIndex(currentIndex);
  });
});

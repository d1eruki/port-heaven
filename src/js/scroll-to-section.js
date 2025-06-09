const headerLinks = document.querySelectorAll("a[data-open-block]");
const sections = Array.from(headerLinks)
  .map((link) => {
    const id = link.getAttribute("href");
    if (!id || !id.startsWith("#")) {
      console.warn(`Invalid href: ${id}`);
      return null;
    }
    const section = document.querySelector(id);
    if (!section) {
      console.warn(`Section not found for ID: ${id}`);
    }
    return section;
  })
  .filter((section) => section !== null);

console.log(`Found ${sections.length} valid sections`);

const bannerElement = document.getElementById("banner");
const bannerHeight = bannerElement ? bannerElement.offsetHeight : 0;
console.log(`Banner element height: ${bannerHeight}px`);

function setActiveLinkByIndex(index) {
  console.log(`Setting active link to index ${index}`);
  headerLinks.forEach((link, i) => {
    link.classList.toggle("active", i === index);
  });
}

function scrollToSection(section) {
  if (!section) {
    console.warn("Cannot scroll: section is null");
    return;
  }
  const targetY = section.offsetTop - bannerHeight; // Отступ равен высоте #banner

  console.log(`Scrolling to section at y=${targetY}`);
  window.isAutoScrolling = true;
  window.scrollTo({ top: targetY, behavior: "smooth" });
  setTimeout(() => {
    window.isAutoScrolling = false;
  }, 1000); // 1 сек для завершения анимации
}

let lastScrollY = window.scrollY;
let isAutoScrolling = false;

function getCurrentSectionIndex() {
  const scrollY = window.scrollY;
  let currentIndex = 0;

  console.log(`Current scrollY: ${scrollY}`);
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (!section) {
      console.warn(`Section ${i} is null`);
      continue;
    }

    const sectionTop = section.offsetTop; // Пересчитываем при каждом скролле
    const sectionHeight = section.offsetHeight;
    console.log(`Section ${i}: top=${sectionTop}, height=${sectionHeight}`);
    if (scrollY >= sectionTop - window.innerHeight / 2) {
      currentIndex = i;
    } else {
      break;
    }
  }

  console.log(`Current section index: ${currentIndex}`);
  return currentIndex;
}

// Проверка, является ли устройство мобильным
function isMobileDevice() {
  const isMobileWidth = window.innerWidth <= 768; // Порог для мобильных устройств
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobileUA = /mobile|android|iphone|ipad|tablet/i.test(userAgent);
  return isMobileWidth || isMobileUA;
}

window.addEventListener("scroll", () => {
  if (isAutoScrolling) return; // Пропускаем, если уже прокручиваем

  // Отключаем автопрокрутку на мобильных устройствах
  if (isMobileDevice()) {
    console.log("Autoscrolling disabled on mobile device");
    return;
  }

  const currentScrollY = window.scrollY;
  const direction = currentScrollY > lastScrollY ? "down" : "up";
  lastScrollY = currentScrollY;

  console.log(`Scroll direction: ${direction}, scrollY: ${currentScrollY}`);

  const currentIndex = getCurrentSectionIndex();
  let targetIndex = currentIndex;

  const currentSection = sections[currentIndex];
  if (!currentSection) {
    console.warn("Current section is null");
    return;
  }

  const sectionTop = currentSection.offsetTop;

  // Прокрутка вниз
  if (direction === "down" && currentIndex < sections.length - 1) {
    if (currentScrollY > sectionTop + 100) {
      targetIndex = currentIndex + 1;
      console.log(`Autoscrolling down to section ${targetIndex}`);
    }
  }
  // Прокрутка вверх
  else if (direction === "up" && currentIndex > 0) {
    if (currentScrollY < sectionTop - 100) {
      targetIndex = currentIndex - 1;
      console.log(`Autoscrolling up to section ${targetIndex}`);
    }
  }

  if (targetIndex !== currentIndex && sections[targetIndex]) {
    scrollToSection(sections[targetIndex]);
  }
  setActiveLinkByIndex(targetIndex);
});

headerLinks.forEach((link, i) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      console.log(`Clicked link, scrolling to section ${i}`);
      scrollToSection(targetEl);
      setActiveLinkByIndex(i);
    } else {
      console.warn(`Element with ID ${targetId} not found`);
    }
  });
});

window.addEventListener("load", () => {
  const currentIndex = getCurrentSectionIndex();
  console.log(`Page loaded, setting initial active link to index ${currentIndex}`);
  setActiveLinkByIndex(currentIndex);
});

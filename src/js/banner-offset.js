function adjustOffsets() {
  const banner = document.getElementById("banner");
  const leftMenu = document.getElementById("left-menu");
  const rightMenu = document.getElementById("right-menu");
  const progress = document.getElementById("progress-bar");

  if (!banner) return;

  const offset = banner.offsetHeight + "px";
  const isDesktop = window.innerWidth >= 768;

  if (leftMenu) {
    leftMenu.style.top = offset;
    leftMenu.style.bottom = "";
  }

  if (rightMenu) {
    if (isDesktop) {
      rightMenu.style.top = offset;
      rightMenu.style.bottom = "";
    } else {
      rightMenu.style.top = "";
      rightMenu.style.bottom = "0";
    }
  }

  if (progress) {
    progress.style.top = offset;
  }
}

window.addEventListener("load", adjustOffsets);
window.addEventListener("resize", adjustOffsets);

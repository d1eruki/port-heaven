export const updateProgressBar = (scrollY = 0) => {
  const progressBar = document.getElementById("progress-bar");
  if (!progressBar) return;

  const totalHeight = document.body.scrollHeight - window.innerHeight;
  const progress = totalHeight > 0 ? Math.min((scrollY / totalHeight) * 100, 100) : 0;

  progressBar.style.height = `${progress}%`;
};

window.addEventListener("beforeunload", () => {
  const y = window.lenis ? window.lenis.scroll : window.scrollY;
  localStorage.setItem("scrollY", y.toString());
});

window.addEventListener("load", () => {
  const saved = localStorage.getItem("scrollY");
  if (saved !== null && window.lenis) {
    // пусть плавно подхватывает
    window.lenis.scrollTo(parseInt(saved, 10), { immediate: true });
  } else if (saved !== null) {
    window.scrollTo(0, parseInt(saved, 10));
  }
  updateProgressBar(window.lenis ? window.lenis.scroll : window.scrollY);
});

window.addEventListener("resize", () => {
  updateProgressBar(window.lenis ? window.lenis.scroll : window.scrollY);
});

window.addEventListener("lenis-scroll", (e) => {
  updateProgressBar(e.detail.y);
});

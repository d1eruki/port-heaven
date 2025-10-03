export const updateProgressBar = () => {
  const progressBar = document.getElementById("progress-bar");

  const totalHeight = document.body.scrollHeight - window.innerHeight;
  const scrollY = window.scrollY;

  const progress = totalHeight > 0 ? Math.min((scrollY / totalHeight) * 100, 100) : 0;

  progressBar.style.width = `${progress}%`;
};

window.addEventListener("beforeunload", () => {
  localStorage.setItem("scrollY", window.scrollY.toString());
});

window.addEventListener("load", () => {
  const savedScrollY = localStorage.getItem("scrollY");
  if (savedScrollY !== null) {
    window.scrollTo(0, parseInt(savedScrollY, 10));
  }
  updateProgressBar();
});

window.addEventListener("scroll", updateProgressBar);
window.addEventListener("resize", updateProgressBar);

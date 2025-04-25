export const updateProgressBar = () => {
  const progressBar = document.getElementById("progress-bar");
  const totalHeight = document.body.scrollHeight - window.innerHeight;
  progressBar.style.width = totalHeight > 0 ? `${(window.scrollY / totalHeight) * 100}%` : "0%";
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

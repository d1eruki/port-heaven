export const toggleContent = (target) => {
  const activeBlock = document.querySelector("[data-open-block].active");

  if (!activeBlock || activeBlock.getAttribute("data-open-block") !== target) {
    if (activeBlock) activeBlock.classList.remove("active");

    const newActiveBlock = document.querySelector(`[data-open-block][data-open-block="${target}"]`);
    if (newActiveBlock) newActiveBlock.classList.add("active");
  }
};

document.querySelectorAll("[data-open-block]").forEach((button) => {
  button.addEventListener("click", function () {
    toggleContent(this.getAttribute("data-open-block"));
  });
});

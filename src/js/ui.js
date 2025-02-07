export const setHeight = () => {
    const footer = document.querySelector('footer');
    const header = document.querySelector('header');

    if (!footer || !header) return;

    footer.style.height = `${header.offsetHeight}px`;
};

export const toggleContent = (target) => {
    const activeBlock = document.querySelector("[data-open-block].active");
    const activeContent = document.querySelector("[data-content].is-active");
    const targetContent = document.querySelector(`[data-content="${target}"]`);

    if (!activeBlock || activeBlock.getAttribute('data-open-block') !== target) {
        if (activeBlock) activeBlock.classList.remove("active");

        const newActiveBlock = document.querySelector(`[data-open-block][data-open-block="${target}"]`);
        if (newActiveBlock) newActiveBlock.classList.add("active");
    }
};

document.querySelectorAll("[data-open-block]").forEach(button => {
    button.addEventListener("click", function () {
        toggleContent(this.getAttribute("data-open-block"));
    });
});

export const updateProgressBar = () => {
    const progressBar = document.getElementById('progress-bar');
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    progressBar.style.width = totalHeight > 0
        ? `${(window.scrollY / totalHeight) * 100}%`
        : '0%';
};

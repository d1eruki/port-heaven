export const setHeight = () => {
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const heightTarget = document.getElementById('height-target');

    if (!header || !footer) return;

    const headerHeight = header.offsetHeight;
    footer.style.height = `${headerHeight}px`;

    const isScrollable = document.body.scrollHeight > window.innerHeight;

    heightTarget.style.height = isScrollable
        ? 'auto'
        : `calc(100vh - ${headerHeight}px - ${headerHeight}px)`;

    document.body.classList.add('loaded');
};

export const toggleContent = (target) => {
    const activeBlock = document.querySelector("[data-open-block].active");
    const activeContent = document.querySelector("[data-content].is-active");
    const targetContent = document.querySelector(`[data-content="${target}"]`);

    if (!activeBlock || activeBlock.getAttribute('data-open-block') !== target) {
        if (activeBlock) activeBlock.classList.remove("active");
        if (activeContent) activeContent.classList.remove("is-active");

        const newActiveBlock = document.querySelector(`[data-open-block][data-open-block="${target}"]`);
        newActiveBlock.classList.add("active");
        targetContent.classList.add("is-active");

        setHeight();       // Обновляем высоты после изменения контента
        window.scrollTo(0, 0); // Сбрасываем прокрутку наверх
    }
};

export const updateProgressBar = () => {
    const progressBar = document.getElementById('progress-bar');
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    progressBar.style.width = totalHeight > 0
        ? `${(window.scrollY / totalHeight) * 100}%`
        : '0%';
};

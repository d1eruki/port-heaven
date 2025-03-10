export const updateProgressBar = () => {
    const progressBar = document.getElementById('progress-bar');
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    progressBar.style.width = totalHeight > 0
        ? `${(window.scrollY / totalHeight) * 100}%`
        : '0%';
};

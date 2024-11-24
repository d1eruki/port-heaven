import '../css/styles.scss';
import { setHeight, toggleContent, updateProgressBar } from './ui';
import { generateChessboard } from './chessboard';
import { updateHeaderOnScroll } from './scroll-header';
import './vue'

document.addEventListener('DOMContentLoaded', () => {
    setHeight();
    updateProgressBar();

    document.querySelectorAll("[data-open-block]").forEach(button => {
        button.addEventListener("click", function () {
            toggleContent(this.getAttribute("data-open-block"));
        });
    });
});

window.onscroll = updateProgressBar;

generateChessboard();
updateHeaderOnScroll();

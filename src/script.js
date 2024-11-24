import './style.scss';
import { setHeight, toggleContent, updateProgressBar } from './js/ui';
import { generateChessboard } from './js/chessboard';
import { updateHeaderOnScroll } from './js/scroll-header';
import './js/vue';

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

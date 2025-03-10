import './style.scss';
import { setHeight } from './js/menu-swap';
import { updateProgressBar } from './js/progress-bar';
import { generateChessboard } from './js/chessboard';
import { updateHeaderOnScroll } from './js/scroll-header';
import './js/vue';

document.addEventListener('DOMContentLoaded', () => {
    setHeight();
    updateProgressBar();
});

window.onscroll = updateProgressBar;

generateChessboard();
updateHeaderOnScroll();

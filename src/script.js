import './style.scss';
import { setHeight, updateProgressBar } from './js/ui';
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

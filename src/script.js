import './style.scss';
import './js/menu-swap';
import './js/vue';
import {setHeight} from './js/header-footer-height';
import {updateProgressBar} from './js/progress-bar';
import {generateChessboard} from './js/chessboard';
import {updateHeaderOnScroll} from './js/scroll-header';
import './js/card-rotate'; // Импорт нового файла

document.addEventListener('DOMContentLoaded', () => {
    setHeight();
});

window.onscroll = updateProgressBar;
generateChessboard();
updateHeaderOnScroll();

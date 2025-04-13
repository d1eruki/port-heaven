import './style.scss';
import './js/menu-swap';
import './js/vue';
import {setHeight} from './js/header-footer-height';
import {updateProgressBar} from './js/progress-bar';
import {generateChessboard} from './js/chessboard';
import {updateHeaderOnScroll} from './js/scroll-header';
import VanillaTilt from 'vanilla-tilt';

document.addEventListener('DOMContentLoaded', () => {
    setHeight();

    const pok = document.querySelector(".pok");
    if (pok) {
        VanillaTilt.init(pok, {
            speed: 1000,
            transition: true,
            easing: "cubic-bezier(0.23, 1, 0.32, 1)",
            glare: true,
            "max-glare": 0.35
        });
    }
});

window.onscroll = updateProgressBar;
generateChessboard();
updateHeaderOnScroll();

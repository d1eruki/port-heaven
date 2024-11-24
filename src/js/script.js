import '../css/styles.scss';
import { createApp } from 'vue';
import Items from './components/Items.vue';
import { setHeight, toggleContent, updateProgressBar } from './ui';
import { generateChessboard } from './chessboard';
import { updateHeaderOnScroll } from './scroll-header';

const designItem = createApp({});
designItem.component('design-item', Items);
designItem.mount('#design-item');

const webItem = createApp({});
webItem.component('web-item', Items);
webItem.mount('#web-item');

const videoItem = createApp({});
videoItem.component('video-item', Items);
videoItem.mount('#video-item');

const otherItem = createApp({});
otherItem.component('other-item', Items);
otherItem.mount('#other-item');

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

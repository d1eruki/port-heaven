import { createApp } from 'vue';
import Items from './components/Items.vue';
import Locales from './components/Locales.vue';
import i18n from './i18n';

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

createApp(Locales)
    .use(i18n)
    .mount('#locales');

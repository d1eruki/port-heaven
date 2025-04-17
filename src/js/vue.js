import { createApp } from "vue";
import Items from "./components/Items.vue";

const designItem = createApp({});
designItem.component("design-item", Items);
designItem.mount("#design-item");

const webItem = createApp({});
webItem.component("web-item", Items);
webItem.mount("#web-item");

const videoItem = createApp({});
videoItem.component("video-item", Items);
videoItem.mount("#video-item");

const otherItem = createApp({});
otherItem.component("other-item", Items);
otherItem.mount("#other-item");

import { createApp } from "vue";
import Items from "./components/Items.vue";

const designApp = createApp({});
designApp.component("design-item", Items);
designApp.mount("#design-app");

const webApp = createApp({});
webApp.component("web-item", Items);
webApp.mount("#web-app");

const videoApp = createApp({});
videoApp.component("video-item", Items);
videoApp.mount("#video-app");

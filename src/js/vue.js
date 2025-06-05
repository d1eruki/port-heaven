import { createApp } from "vue";
import Items from "./components/items.vue";
import Icons from "./components/section-icons.vue";
import Bullets from "./components/bullets.vue";
import Features from "./components/key-features.vue";

const app = createApp({});
app.component("item", Items);
app.component("icon", Icons);
app.component("bullet", Bullets);
app.component("futures", Features);
app.mount("#app");

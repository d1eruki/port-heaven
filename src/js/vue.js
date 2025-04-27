import { createApp } from "vue";
import Items from "./components/items.vue";
import Icons from "./components/section-icons.vue";

const app = createApp({});
app.component("item", Items);
app.component("icon", Icons);
app.mount("#app");

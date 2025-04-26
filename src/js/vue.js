import { createApp } from "vue";
import Items from "./components/Items.vue";

const itemApp = createApp({});
itemApp.component("item", Items);
itemApp.mount("#item-app");

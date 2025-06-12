import { createApp } from "vue";
import Projects from "./components/projects.vue";
import Bullets from "./components/bullets.vue";
import Features from "./components/key-features.vue";
import Icons from "./components/icons.vue";
import Items from "./components/items.vue";
import Buttons from "./components/button.vue";
import i18n from "./i18n";
import { useI18n } from "vue-i18n";

const app = createApp({
  setup() {
    const { t } = useI18n();
    return { t };
  },
});

app.component("Project", Projects);
app.component("Bullet", Bullets);
app.component("Futures", Features);
app.component("Icons", Icons);
app.component("Items", Items);
app.component("Button", Buttons);
app.use(i18n);
app.mount("#app");

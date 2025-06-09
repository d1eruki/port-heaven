import { createApp } from "vue";
import Projects from "./components/projects.vue";
import Bullets from "./components/bullets.vue";
import Features from "./components/key-features.vue";
import Icons from "./components/icons.vue";
import i18n from "./i18n";
import { useI18n } from "vue-i18n";

const app = createApp({
  setup() {
    const { t } = useI18n();
    return { t };
  },
});

app.component("project", Projects);
app.component("bullet", Bullets);
app.component("futures", Features);
app.component("icons", Icons);
app.use(i18n);
app.mount("#app");

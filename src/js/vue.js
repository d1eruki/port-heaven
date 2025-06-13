import { createApp } from "vue";
import Projects from "./components/projects.vue";
import Bullets from "./components/bullets.vue";
import Principles from "./components/principles.vue";
import Icons from "./components/icons.vue";
import Items from "./components/items.vue";
import CustomButtons from "./components/custom-button.vue";
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
app.component("Principles", Principles);
app.component("Icons", Icons);
app.component("Items", Items);
app.component("CustomButtons", CustomButtons);
app.use(i18n);
app.mount("#app");

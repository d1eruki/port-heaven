import { createApp } from "vue";
import Projects from "./components/projects.vue";
import Designs from "./components/designs.vue";
import NavButton from "./components/nav-button.vue";

import i18n from "./i18n";
import { useI18n } from "vue-i18n";

const app = createApp({
  setup() {
    const { t } = useI18n();
    return { t };
  },
});

app.component("project", Projects);
app.component("design", Designs);
app.component("navButton", NavButton);

app.use(i18n);
app.mount("#app");
app.config.globalProperties.t = i18n.global.t;

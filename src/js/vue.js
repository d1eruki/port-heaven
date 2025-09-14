import { createApp } from "vue";
import Projects from "./components/projects.vue";
import Icons from "./components/icons.vue";
import Items from "./components/items.vue";

import i18n from "./i18n";
import { useI18n } from "vue-i18n";

const app = createApp({
  setup() {
    const { t } = useI18n();
    return { t };
  },
});

app.component("project", Projects);
app.component("icons", Icons);
app.component("items", Items);

app.use(i18n);
app.mount("#app");
app.config.globalProperties.t = i18n.global.t;

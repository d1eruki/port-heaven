import { createApp } from "vue";
import Projects from "../vue-components/projects.vue";
import Designs from "../vue-components/designs.vue";
import Creatives from "../vue-components/creatives.vue";
import NavButton from "../vue-components/nav-button.vue";
import MenuDesc from "../vue-components/menu-description.vue";

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
app.component("creative", Creatives);
app.component("navButton", NavButton);
app.component("menuDesc", MenuDesc);

app.use(i18n);
app.mount("#app");
app.config.globalProperties.t = i18n.global.t;

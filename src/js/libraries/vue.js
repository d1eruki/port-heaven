import { createApp } from "vue";
import Projects from "../vue-components/projects.vue";
import Designs from "../vue-components/designs.vue";
import imgCreatives from "../vue-components/img-creatives.vue";
import videoCreatives from "../vue-components/video-creatives.vue";
import NavButton from "../vue-components/nav-button.vue";
import MenuDesc from "../vue-components/menu-description.vue";
import Features from "../vue-components/features.vue";

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
app.component("img-creative", imgCreatives);
app.component("video-creative", videoCreatives);
app.component("navButton", NavButton);
app.component("menuDesc", MenuDesc);
app.component("feature", Features);

app.use(i18n);
app.mount("#app");
app.config.globalProperties.t = i18n.global.t;

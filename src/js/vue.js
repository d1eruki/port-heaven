import { createApp } from "vue";
import Projects from "./components/projects.vue";
import Bullets from "./components/bullets.vue";
import Principles from "./components/principles.vue";
import Icons from "./components/icons.vue";
import Items from "./components/items.vue";
import Contacts from "./components/contacts.vue";
import CustomButtons from "./components/custom-button.vue";
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
app.component("bullet", Bullets);
app.component("principles", Principles);
app.component("icons", Icons);
app.component("items", Items);
app.component("customButtons", CustomButtons);
app.component("navButton", NavButton);
app.component("contacts", Contacts);
app.use(i18n);
app.mount("#app");
app.config.globalProperties.t = i18n.global.t;

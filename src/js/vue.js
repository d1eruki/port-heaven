import { createApp } from "vue";
import Items from "./components/items.vue";
import Icons from "./components/section-icons.vue";
import Bullets from "./components/bullets.vue";
import Features from "./components/key-features.vue";
import i18n from './i18n'
import { useI18n } from 'vue-i18n'

const app = createApp({
  setup() {
    const { t } = useI18n()
    return { t }
  }
})

app.component("item", Items);
app.component("icon", Icons);
app.component("bullet", Bullets);
app.component("futures", Features);
app.use(i18n)
app.mount("#app");

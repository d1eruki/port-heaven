<template>
  <section
    data-section="footer"
    id="footer"
    class="flex min-h-dvh flex-col justify-center gap-5 justify-self-center p-10 lg:w-200"
  >
    <h2 class="glow-lg">{{ t("menu.footer.title") }}</h2>
    <p>{{ t("menu.footer.description") }}</p>
  </section>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <section
    data-section="me"
    id="me"
    class="lancet-hero min-h-dvh content-end p-10"
  >
    <h1 class="glow-xl">{{ t("brand.hero") }}</h1>
  </section>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <a :href="`#${navName}`" :data-open-block="navName" :data-scroll-target="`[data-section='${navName}']`">
    {{ t(navName === "design" ? "menu-designs" : `menu-${navName}`) }}
  </a>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps({
  navName: {
    type: String,
    required: true,
  },
});
</script>

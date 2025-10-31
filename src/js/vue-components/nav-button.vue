<template>
  <button :data-open-block="navName" :data-scroll-target="`[data-section='${navName}']`" class="light:text-neutral-500 self-start text-start mix-blend-difference transition-colors duration-300">
    {{ t(navName === "design" ? "menu-designs" : `menu-${navName}`) }}
  </button>
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

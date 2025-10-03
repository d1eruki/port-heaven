<template>
  <a :href="`#${navName}`" :data-open-block="navName" :data-scroll-target="`[data-section='${navName}']`" class="w-fit content-center p-2.5 lg:block lg:px-10 lg:py-5">
    {{ t(`menu-${navName}`) }}
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

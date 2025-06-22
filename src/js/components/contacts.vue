<template>
  <div class="flex justify-between gap-10 p-5 lg:flex-col">
    <h2>{{ t("menu-footer") }}</h2>
    <div class="flex items-center gap-5 lg:flex-col lg:items-end">
      <a class="w-fit" href="https://t.me/d1eruki" target="_blank">
        <Icons icon="telegram"></Icons>
      </a>
      <a class="w-fit" href="mailto:stapps90@gmail.com" target="_blank">
        <Icons icon="google-mail"></Icons>
      </a>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>

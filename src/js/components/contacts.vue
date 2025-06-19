<template>
  <div class="light:bg-[var(--green)] flex justify-between gap-10 p-5 lg:flex-col">
    <h3>{{ t("contacts") }}</h3>
    <div class="flex gap-5 lg:flex-col">
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

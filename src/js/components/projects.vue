<template>
  <div class="flex flex-row">
    <div class="light:text-[var(--white)]! light:bg-[var(--black)] h-fit w-full">
      <div class="3xl:pl-150 4xl:pl-175 flex flex-col gap-10 p-10 lg:pl-75">
        <p>{{ t("projects-project") }}</p>
        <h3>{{ projectName }}</h3>
        <p>{{ projectDescription }}</p>
      </div>
      <div class="flex w-full flex-row justify-end">
        <Button v-for="(link, index) in projectLinks" :key="index" :url="link.url" :name="link.name" />
      </div>
    </div>
    <div class="light:bg-[var(--yellow)] hidden w-full flex-col justify-between gap-10 p-10 md:flex">
      <h4>{{ t("projects-stat-after-launch") }}</h4>
      <div>
        <p>{{ projectStatistic }}</p>
      </div>
      <p>{{ projectStatistic }}</p>
    </div>
  </div>
</template>

<script setup>
import Button from "./button.vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps({
  projectName: {
    type: String,
    required: true,
    default: "Default Title",
  },
  projectDescription: {
    type: String,
    required: true,
    default: "Default Description",
  },
  projectStatistic: {
    type: String,
    required: true,
    default: "Default Description",
  },
  projectLinks: {
    type: Array,
    required: true,
    default: () => [],
  },
});
</script>

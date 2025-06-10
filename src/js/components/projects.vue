<template>
  <div class="flex flex-row">
    <div class="light:text-[var(--white)]! light:bg-[var(--black)] h-fit w-full">
      <div class="3xl:pl-150 4xl:pl-175 flex flex-col gap-10 p-10 lg:pl-75">
        <h3>{{ projectName }}</h3>
        <p>{{ projectDescription }}</p>
      </div>
      <div class="flex w-full flex-row justify-end">
        <Button v-for="(link, index) in projectLinks" :key="index" :url="link.url" :name="link.name" />
      </div>
    </div>
    <div class="light:bg-[var(--yellow)] hidden w-full flex-col justify-between gap-10 p-10 md:flex">
      <h4>{{ t("projects-stat-after-launch") }}</h4>
      <p>{{ projectResult }}</p>
      <div>
        <p v-for="(statistic, index) in projectStatistic" :key="index">{{ statistic }}</p>
      </div>
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
  projectResult: {
    type: String,
    required: true,
    default: "Default Result",
  },
  projectStatistic: {
    type: Array,
    required: true,
    default: () => ["Default Statistic"],
  },
  projectLinks: {
    type: Array,
    required: true,
    default: () => [],
  },
});
</script>

<template>
  <div class="flex flex-row">
    <div class="light:text-[var(--white)]! light:bg-[var(--black)] 3xl:pl-150 4xl:pl-175 h-fit w-full lg:pl-75">
      <div class="flex flex-col gap-10 p-10">
        <h3>{{ projectName }}</h3>
        <p>{{ projectDescription }}</p>
      </div>
      <div class="flex w-full flex-row justify-end">
        <Button v-for="(link, index) in projectLinks" :key="index" :url="link.url" :name="link.name" />
      </div>
    </div>
    <div class="light:bg-[var(--yellow)] 3xl:pr-150 4xl:pr-175 hidden w-full flex-col justify-between gap-10 p-10 md:flex lg:pr-75">
      <h3>{{ t("projects-stat-after-launch") }}</h3>
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

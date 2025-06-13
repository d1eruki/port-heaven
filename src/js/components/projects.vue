<template>
  <div class="light:bg-[var(--white)] flex flex-col gap-10">
    <h3 class="light:text-[var(--black)] light:bg-[var(--yellow)] p-5">{{ projectName }}</h3>
    <div class="flex flex-col gap-10 p-5">
      <p class="light:text-[var(--black)]!">{{ projectDescription }}</p>
      <h4>{{ t("projects-stat-after-launch") }}</h4>
      <p class="text-[var(--black)]!">{{ projectResult }}</p>
      <div class="flex flex-col gap-2">
        <div v-for="(statistic, index) in projectStatistic" :key="index" class="flex items-center gap-3">
          <Icons icon="star"></Icons>
          <p class="text-[var(--black)]!">{{ statistic }}</p>
        </div>
      </div>
    </div>
    <div class="flex w-full justify-end gap-1 lg:gap-0 h-fit">
      <CustomButton v-for="(link, index) in projectLinks" :key="index" :url="link.url" :name="link.name" />
    </div>
  </div>
</template>

<script setup>
import CustomButton from "./custom-button.vue";
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

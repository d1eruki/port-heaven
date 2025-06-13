<template>
  <div class="grid grid-cols-1">
    <div class="light:bg-[var(--yellow)] flex aspect-square flex-col justify-between p-5">
      <h3 class="light:text-[var(--black)]">{{ projectName }}</h3>
      <p class="light:text-[var(--black)]!">{{ projectDescription }}</p>
    </div>
    <div class="light:bg-[var(--white)] flex aspect-square flex-col justify-between outline">
      <div class="flex flex-col gap-5 p-5">
        <h3>{{ t("projects-stat-after-launch") }}</h3>
        <p class="text-[var(--black)]!">{{ projectResult }}</p>
        <div class="flex flex-col gap-2">
          <div v-for="(statistic, index) in projectStatistic" :key="index" class="flex items-center gap-3">
            <Icons icon="star"></Icons>
            <p class="text-[var(--black)]!">{{ statistic }}</p>
          </div>
        </div>
      </div>
      <div class="flex w-full justify-end gap-1 lg:gap-0">
        <CustomButton v-for="(link, index) in projectLinks" :key="index" :url="link.url" :name="link.name" />
      </div>
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

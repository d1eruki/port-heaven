<template>
  <div class="light:bg-[var(--white)] grid h-full flex-row justify-between  lg:grid-cols-1 lg:flex-col">
    <div class="flex flex-col gap-10 p-5">
      <h3 class="light:text-[var(--black)]">{{ projectName }}</h3>
      <p class="light:text-[var(--grey)]!">{{ projectDescription }}</p>
      <h4>{{ t("projects-stat-after-launch") }}</h4>
      <p class="text-[var(--grey)]!">{{ projectResult }}</p>
      <div class="flex flex-col gap-2">
        <div v-for="(statistic, index) in projectStatistic" :key="index" class="flex items-center gap-3">
          <Icons class="text-[var(--grey)]!" icon="star"></Icons>
          <p class="text-[var(--grey)]!">{{ statistic }}</p>
        </div>
      </div>
    </div>
    <div class="flex h-fit w-full justify-end">
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

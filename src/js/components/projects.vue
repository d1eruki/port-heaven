<template>
  <div class="light:bg-[var(--white)] grid h-full grid-cols-1 lg:flex-row flex-col lg:grid-cols-3">
    <div class="light:bg-[var(--blue)]  col-span-1  flex flex-col justify-between">
      <h3 class="light:text-[var(--white)] p-5">{{ projectName }}</h3>
      <div class="flex h-fit w-full justify-end">
        <CustomButton v-for="(link, index) in projectLinks" :key="index" :url="link.url" :name="link.name" />
      </div>
    </div>
    <div class="lg:col-span-2 col-span-1 flex flex-col gap-10 p-5 border">
      <p class="light:text-[var(--grey)]!">{{ projectDescription }}</p>
      <h4>{{ t("projects-stat-after-launch") }}</h4>
      <p class="text-[var(--grey)]!">{{ projectResult }}</p>
      <div class="flex flex-col gap-2">
        <div v-for="(statistic, index) in projectStatistic" :key="index" class="flex items-center gap-3">
          <p class="text-[var(--grey)]!">{{ statistic }}</p>
        </div>
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

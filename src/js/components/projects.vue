<template>
  <div class="swiper-slide col-span-1 flex! h-auto! flex-col! justify-between">
    <div class="flex flex-col gap-5 p-5">
      <h3>{{ projectName }}</h3>
      <button data-micromodal-trigger="modal-1">{{ t("projects-open-description") }}</button>
      <p class="light:text-[var(--grey)]! lg:mb-15">{{ projectDescription }}</p>
      <h4>{{ t("projects-stat-after-launch") }}</h4>
      <p class="text-[var(--grey)]!">{{ projectResult }}</p>
      <div class="flex flex-col gap-2">
        <div v-for="(statistic, index) in projectStatistic" :key="index" class="flex items-center gap-3">
          <Icons class="hidden text-[var(--grey)]!" icon="star"></Icons>
          <p class="text-[var(--grey)]!">{{ statistic }}</p>
        </div>
      </div>
    </div>
    <div class="flex h-fit w-full justify-end">
      <CustomButton class="w-full" v-for="(link, index) in projectLinks" :key="index" :url="link.url" :name="link.name" />
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
  },
  projectResult: {
    type: String,
  },
  projectStatistic: {
    type: Array,
  },
  projectLinks: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <div class="flex flex-row">
    <div class="light:text-[var(--white)]! light:bg-[var(--black)] h-fit w-full">
      <div class="3xl:pl-150 4xl:pl-175 flex flex-col gap-10 p-10 lg:pl-75">
        <p>{{ t("projects-project") }}</p>
        <h3>{{ projectName }}</h3>
        <p>{{ projectDescription }}</p>
      </div>
      <div class="flex w-full flex-row justify-end">
        <a class="light:bg-[var(--white)] light:text-[var(--black)]! px-10 py-2" :href="projectDesignUrl" target="_blank">макет</a>
        <a class="light:bg-[var(--white)] light:text-[var(--black)]! px-10 py-2" :href="projectSiteUrl" target="_blank">сайт</a>
      </div>
    </div>
    <div class="light:bg-[var(--yellow)] hidden w-full p-10 md:block">
      <p class="light:text-[var(--black)]!">{{ projectStatistic }}</p>
    </div>
  </div>
</template>

<script setup>
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
  projectDesignUrl: {
    type: String,
    required: true,
    default: "https://www.youtube.com/",
  },
  projectSiteUrl: {
    type: String,
    required: false,
    default: "https://www.youtube.com/",
  },
});
</script>

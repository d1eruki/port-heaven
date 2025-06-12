<template>
  <div class="flex flex-row">
    <div class="light:text-[var(--white)]! light:bg-[var(--black)] lg:w-[50%]">
      <div class="3xl:ml-150 4xl:ml-175 h-auto lg:ml-75">
        <div class="flex flex-col gap-10 px-5 py-10 lg:pr-5 lg:pl-0">
          <h3>{{ projectName }}</h3>
          <p>{{ projectDescription }}</p>
        </div>
        <div class="flex w-full flex-row justify-end gap-1 lg:gap-0">
          <Button v-for="(link, index) in projectLinks" :key="index" :url="link.url" :name="link.name" />
        </div>
      </div>
    </div>
    <div class="light:bg-[var(--yellow)] hidden w-[50%] lg:block">
      <div class="3xl:mr-150 4xl:mr-175 my-10 ml-10 flex flex-col justify-between gap-10 lg:mr-75">
        <h3>{{ t("projects-stat-after-launch") }}</h3>
        <p class="text-[var(--black)]!">{{ projectResult }}</p>
        <div class="flex flex-col gap-2">
          <div v-for="(statistic, index) in projectStatistic" :key="index" class="flex items-center gap-3">
            <Icons icon="star"></Icons>
            <p class="text-[var(--black)]!">{{ statistic }}</p>
          </div>
        </div>
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

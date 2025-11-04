<template>
  <div class="light:lg:bg-black min-h-dvh w-full">
    <div class="swiper mySwiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          <img src="../../assets/projects/varwin/cover.png" alt="project-1" />
        </div>
        <div class="swiper-slide">
          <img src="../../assets/projects/varwin/screen-1.png" alt="project-2" />
        </div>
      </div>
      <div class="swiper-pagination light:bg-white light:text-black absolute bottom-0 left-0 z-100 w-fit px-2.5 py-1"></div>
    </div>
    <div class="flex flex-col justify-between gap-10 p-15">
      <div class="flex flex-col gap-5">
        <h3 class="light:text-white">{{ projectName }}</h3>
        <p class="light:text-neutral-500">{{ projectDescription }}</p>
        <Tags :tags="projectTags" :show-icons="true" />
      </div>
      <div class="flex flex-col gap-5">
        <p v-for="(text, index) in projectText" :key="index" class="light:text-white">{{ text }}</p>
      </div>
      <div class="flex flex-wrap gap-5 lg:gap-10">
        <a v-for="(link, index) in projectLinks" :key="index" class="anim-extrude light:bg-primary active flex w-fit px-5 py-2.5 lg:px-10 lg:py-5" :href="link.url" target="_blank">
          <p class="light:text-black font-[Actay_Wide]">{{ link.name }}</p>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import Tags from "./tags.vue";

const props = defineProps({
  projectName: {
    type: String,
    required: true,
    default: "Default title",
  },
  projectDescription: {
    type: String,
    required: true,
    default: "Default description",
  },
  projectTags: {
    type: Array,
    default: () => [],
  },
  projectText: {
    type: Array,
    default: () => [],
  },
  projectResult: String,
  projectStatistic: Array,
  projectLinks: {
    type: Array,
    default: () => [],
  },
});
</script>

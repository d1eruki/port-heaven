<template>
  <div class="min-h-svh w-full lg:bg-canvas">
    <div class="flex min-h-svh flex-col justify-between gap-10 p-15">
      <div class="flex flex-col gap-5">
        <h3 class="text-fg">{{ projectName }}</h3>
        <p class="text-muted">{{ projectDescription }}</p>
        <TagsList
          :tags="projectTags"
          :show-icons="true"
        />
      </div>
      <div class="flex flex-col gap-5">
        <p
          v-for="(text, index) in projectText"
          :key="index"
          class="text-fg"
        >
          {{ text }}
        </p>
      </div>
      <div class="flex flex-wrap gap-5 lg:gap-10">
        <a
          v-for="(link, index) in projectLinks"
          :key="index"
          class="anim-extrude active flex w-fit bg-accent-section px-5 py-2.5 lg:px-10 lg:py-5"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          <p class="font-[Actay_Wide] text-accent-section-fg">{{ link.name }}</p>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import TagsList from "./TagsList.vue";

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
  projectStatistic: Array,
  projectLinks: {
    type: Array,
    default: () => [],
  },
});
</script>

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
      <ol
        v-if="projectStatistic.length"
        class="grid border-y border-border-subtle lg:grid-cols-3"
        data-project-statistics
      >
        <li
          v-for="(statistic, index) in projectStatistic"
          :key="statistic"
          class="grid gap-5 border-b border-border-subtle py-5 last:border-b-0 lg:border-r lg:border-b-0 lg:px-5 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
        >
          <small class="text-muted">/ {{ String(index + 1).padStart(2, "0") }}</small>
          <p class="text-fg">{{ statistic }}</p>
        </li>
      </ol>
      <div class="flex flex-wrap gap-5 lg:gap-10">
        <a
          v-for="(link, index) in projectLinks"
          :key="index"
          class="anim-extrude active flex w-fit bg-accent px-5 py-2.5 lg:px-10 lg:py-5"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          <p class="font-heading text-on-accent">{{ link.name }}</p>
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
  projectStatistic: {
    type: Array,
    default: () => [],
  },
  projectLinks: {
    type: Array,
    default: () => [],
  },
});
</script>

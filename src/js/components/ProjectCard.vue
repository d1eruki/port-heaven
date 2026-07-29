<template>
  <div
    data-project-snap
    class="min-h-svh w-full lg:bg-canvas"
  >
    <div class="flex min-h-svh flex-col justify-center gap-10 p-10 lg:p-15">
      <div class="flex flex-col gap-5">
        <h3 class="text-primary">{{ projectName }}</h3>
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
          class="text-primary"
        >
          {{ text }}
        </p>
      </div>
      <ol
        v-if="projectStatistic.length"
        class="grid border-y border-subtle lg:grid-cols-3"
        data-project-statistics
      >
        <li
          v-for="(statistic, index) in projectStatistic"
          :key="statistic"
          class="grid gap-5 border-b border-subtle py-5 last:border-b-0 lg:border-r lg:border-b-0 lg:px-5 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
        >
          <small class="text-muted">/ {{ String(index + 1).padStart(2, "0") }}</small>
          <p class="text-primary">{{ statistic }}</p>
        </li>
      </ol>
      <div class="flex flex-wrap gap-2 lg:gap-10">
        <ActionLink
          v-for="(link, index) in projectLinks"
          :key="index"
          :href="link.url"
        >
          {{ link.name }}
        </ActionLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import ActionLink from "./ActionLink.vue";
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

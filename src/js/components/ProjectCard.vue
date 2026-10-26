<!-- Карточка проекта с названием, тегами, описанием и ссылками. -->
<template>
  <div
    data-project-snap
    class="w-full max-lg:flex max-lg:flex-col max-lg:rounded-4xl max-lg:bg-surface-subtle lg:min-h-svh lg:bg-canvas no-effects:max-lg:mb-10"
  >
    <div class="flex min-h-[calc(100svh-2rem)] flex-col justify-start gap-10 p-10 max-lg:flex-1 lg:min-h-svh lg:justify-center lg:p-15">
      <div class="flex flex-col gap-5">
        <h3 class="text-primary">{{ projectName }}</h3>
        <TagsList
          class="max-lg:[&_small]:bg-primary/5"
          :tags="projectTags"
          :show-icons="true"
        />
      </div>
      <div class="flex flex-col gap-5">
        <p
          v-for="(text, index) in projectText"
          :key="index"
          class="text-primary max-lg:text-left"
        >
          {{ text }}
        </p>
      </div>
      <div class="flex flex-wrap gap-0 max-lg:mt-auto max-lg:gap-2 max-lg:*:w-full">
        <Button
          v-for="(link, index) in projectLinks"
          :key="index"
          :href="link.url"
        >
          {{ link.name }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from "./Button.vue";
import TagsList from "./TagsList.vue";

const props = defineProps({
  projectName: {
    type: String,
    required: true,
    default: "Default title",
  },
  projectTags: {
    type: Array,
    default: () => [],
  },
  projectText: {
    type: Array,
    default: () => [],
  },
  projectLinks: {
    type: Array,
    default: () => [],
  },
});
</script>

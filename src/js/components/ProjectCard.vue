<!-- Карточка проекта с названием, тегами, описанием и ссылками. -->
<template>
  <div
    data-project-snap
    class="w-full overflow-hidden max-lg:flex max-lg:flex-col max-lg:rounded-4xl max-lg:bg-surface-subtle lg:min-h-svh lg:bg-canvas"
  >
    <div class="flex min-h-[calc(100svh-2rem)] flex-col justify-start gap-content p-panel max-lg:flex-1 lg:min-h-svh lg:justify-center">
      <div class="flex flex-col gap-related">
        <h3 class="text-left text-primary">{{ projectName }}</h3>
        <TagsList
          class="max-lg:[&_small]:bg-primary/5"
          :tags="projectTags"
          :show-icons="true"
        />
      </div>
      <div class="flex flex-col gap-related">
        <p
          v-for="(text, index) in projectText"
          :key="index"
          class="text-primary max-lg:text-left"
        >
          {{ text }}
        </p>
      </div>
      <div class="flex flex-wrap gap-0 max-lg:mt-auto max-lg:gap-related max-lg:*:w-full">
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

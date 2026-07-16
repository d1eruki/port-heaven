<template>
  <a
    :href="designUrl"
    :data-design-name="designName"
    target="_blank"
    rel="noopener noreferrer"
    class="group w-full shrink-0 text-fg hover:bg-hover-accent hover:text-hover-accent-fg effects:lg:h-[50dvh] effects:lg:w-[25dvw] effects:lg:hover:z-51 no-effects:lg:h-[50dvh] no-effects:lg:hover:z-51"
  >
    <div
      class="anim-extrude relative z-10 grid gap-5 p-15 effects:lg:h-full effects:lg:grid-rows-[50%] effects:lg:items-center no-effects:lg:h-full no-effects:lg:grid-rows-[50%] no-effects:lg:items-center"
    >
      <h3 class="flex gap-3 text-heading-sm">
        {{ designName }}
      </h3>
      <div class="flex flex-col gap-5 self-end transition-all duration-100 ease-in-out">
        <TagsList
          :tags="designTags"
          :show-icons="true"
          class="opacity-100 effects:lg:group-hover:hidden effects:lg:group-hover:opacity-0 no-effects:lg:group-hover:hidden no-effects:lg:group-hover:opacity-0"
        />
        <p
          class="effects:lg:hidden effects:lg:opacity-0 effects:lg:group-hover:block effects:lg:group-hover:opacity-100 no-effects:lg:hidden no-effects:lg:opacity-0 no-effects:lg:group-hover:block no-effects:lg:group-hover:opacity-100"
        >
          {{ designDesc }}
        </p>
      </div>
      <span
        class="absolute top-5 right-7.5 icon-[ic--baseline-arrow-outward] scale-200 opacity-0 group-hover:opacity-100"
        aria-hidden="true"
      ></span>
    </div>
  </a>
</template>

<script setup>
import TagsList from "./TagsList.vue";

const props = defineProps({
  designUrl: {
    type: String,
    required: true,
  },
  designName: {
    type: String,
    required: true,
  },
  designDesc: {
    type: String,
    required: true,
  },
  designTags: {
    type: Array,
    default: () => [],
  },
});
</script>

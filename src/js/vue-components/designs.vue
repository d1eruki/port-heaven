<template>
  <a
    :href="designUrl"
    :data-design-name="designName"
    target="_blank"
    rel="noopener noreferrer"
    class="group w-dvw shrink-0 text-fg hover:bg-hover-accent hover:text-hover-accent-fg lg:h-[50dvh] lg:w-[25dvw] lg:hover:z-51"
  >
    <div
      class="anim-extrude relative z-10 grid gap-5 p-15 lg:h-full lg:grid-rows-[50%] lg:items-center"
    >
      <h4 class="flex gap-3">
        {{ designName }}
      </h4>
      <div class="flex flex-col gap-5 self-end transition-all duration-100 ease-in-out">
        <Tags
          :tags="designTags"
          :show-icons="true"
          class="opacity-100 lg:group-hover:hidden lg:group-hover:opacity-0"
        />
        <p class="lg:hidden lg:opacity-0 lg:group-hover:block lg:group-hover:opacity-100">
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
import Tags from "./tags.vue";

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

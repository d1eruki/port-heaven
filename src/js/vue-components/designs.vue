<template>
  <a :href="designUrl" target="_blank" class="light:hover:bg-primary group light:text-white light:hover:text-black">
    <div class="anim-extrude relative z-10 grid gap-5 p-15 hover:z-50 lg:h-[50dvh] lg:items-center">
      <h4 class="flex gap-3">
        {{ designName }}
      </h4>
      <div class="top-75 right-15 bottom-15 left-15 flex flex-wrap gap-5 self-end opacity-100 transition-all duration-100 ease-in-out lg:absolute lg:flex lg:group-hover:opacity-0">
        <Tags :tags="designTags" :show-icons="true" />
      </div>
      <p class="right-15 bottom-15 left-15 block self-end transition-all duration-100 ease-in-out lg:absolute lg:opacity-0 lg:group-hover:opacity-100">{{ designDesc }}</p>
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

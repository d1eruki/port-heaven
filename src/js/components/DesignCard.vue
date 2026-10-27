<!-- Карточка макета со ссылкой, тегами и описанием. -->
<template>
  <a
    :href="designUrl"
    :data-design-name="designName"
    target="_blank"
    rel="noopener noreferrer"
    class="group w-full min-w-0 shrink-0 overflow-hidden rounded-4xl text-primary max-lg:min-h-0 max-lg:bg-canvas effects:max-lg:transition-colors effects:max-lg:duration-300 effects:max-lg:ease-in-out lg:hover:bg-design-card-active lg:hover:text-on-design-card-active lg:hover:z-51 max-lg:[&.design-active]:bg-design-card-active max-lg:[&.design-active]:text-on-design-card-active"
  >
    <div
      class="anim-extrude relative z-10 grid gap-related p-panel max-lg:flex max-lg:h-full max-lg:min-h-0 max-lg:flex-col max-lg:overflow-y-auto lg:h-full lg:grid-rows-[50%] lg:items-center no-effects:lg:hover:transform-none"
    >
      <h3 class="flex gap-3 text-left text-heading-sm">
        {{ designName }}
      </h3>
      <div
        class="flex flex-col gap-related self-end max-lg:flex-1 max-lg:self-stretch lg:grid lg:items-end"
      >
        <TagsList
          :tags="designTags"
          :show-icons="true"
          interactive-contrast
          class="opacity-100 transition-opacity duration-200 ease-in-out lg:col-start-1 lg:row-start-1 lg:group-hover:opacity-0"
        />
        <p
          class="transition-opacity duration-200 ease-in-out max-lg:mt-auto lg:col-start-1 lg:row-start-1 lg:opacity-0 lg:group-hover:opacity-100"
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

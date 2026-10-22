<!-- Карточка макета со ссылкой, тегами и описанием. -->
<template>
  <a
    :href="designUrl"
    :data-design-name="designName"
    target="_blank"
    rel="noopener noreferrer"
    class="group w-full min-w-0 shrink-0 overflow-hidden rounded-4xl text-primary max-lg:min-h-0 lg:hover:bg-design-card-active lg:hover:text-on-design-card-active effects:lg:hover:z-51 no-effects:lg:hover:z-51 max-lg:[&.design-active]:bg-design-card-active max-lg:[&.design-active]:text-on-design-card-active"
  >
    <div
      class="anim-extrude relative z-10 grid gap-5 p-5 max-lg:flex max-lg:h-full max-lg:min-h-0 max-lg:flex-col max-lg:overflow-y-auto lg:p-15 effects:lg:h-full effects:lg:grid-rows-[50%] effects:lg:items-center no-effects:lg:h-full no-effects:lg:grid-rows-[50%] no-effects:lg:items-center no-effects:lg:hover:transform-none"
    >
      <h3 class="flex gap-3 text-heading-sm">
        {{ designName }}
      </h3>
      <div
        class="flex flex-col gap-5 self-end max-lg:flex-1 max-lg:self-stretch effects:lg:grid effects:lg:items-end no-effects:lg:grid no-effects:lg:items-end"
      >
        <TagsList
          :tags="designTags"
          :show-icons="true"
          interactive-contrast
          class="opacity-100 transition-opacity duration-200 ease-in-out effects:lg:col-start-1 effects:lg:row-start-1 effects:lg:group-hover:opacity-0 no-effects:lg:col-start-1 no-effects:lg:row-start-1 no-effects:lg:group-hover:opacity-0"
        />
        <p
          class="transition-opacity duration-200 ease-in-out max-lg:mt-auto effects:lg:col-start-1 effects:lg:row-start-1 effects:lg:opacity-0 effects:lg:group-hover:opacity-100 no-effects:lg:col-start-1 no-effects:lg:row-start-1 no-effects:lg:opacity-0 no-effects:lg:group-hover:opacity-100"
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

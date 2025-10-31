<template>
  <div class="light:lg:bg-black top-0 left-0 col-span-1 flex min-h-dvh w-full flex-col justify-between gap-10 p-15 will-change-transform lg:p-15">
    <div class="flex flex-col gap-5">
      <h3 class="light:text-white">{{ projectName }}</h3>
      <p class="light:text-gray-500">{{ projectDescription }}</p>
      <div class="hidden flex-wrap gap-2 lg:flex">
        <div v-for="(tag, index) in projectTags" :key="index" class="flex">
          <small class="light:text-white light:border-white rounded-4xl border border-solid px-2 py-1.5">{{ getTagName(tag) }}</small>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-5">
      <p v-for="(text, index) in projectText" :key="index" class="light:text-white">{{ text }}</p>
    </div>
    <div class="flex flex-wrap gap-5 lg:gap-10">
      <a v-for="(link, index) in projectLinks" :key="index" class="anim-extrude light:bg-primary active flex w-fit px-5 py-2.5 lg:px-10 lg:py-5" :href="link.url" target="_blank">
        <p class="light:text-black font-[Actay]">{{ link.name }}</p>
      </a>
    </div>
  </div>
</template>

<script setup>
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
  projectResult: String,
  projectStatistic: Array,
  projectLinks: {
    type: Array,
    default: () => [],
  },
});

function getTagName(tag) {
  if (tag == null) return "";
  if (typeof tag === "string" || typeof tag === "number") return String(tag);
  if (typeof tag === "object") {
    return tag.name || tag.label || tag.title || "";
  }
  return "";
}
</script>

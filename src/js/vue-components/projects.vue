<template>
  <div class="top-0 light:bg-(--color-black) left-0 col-span-1 flex min-h-dvh w-full flex-col justify-between gap-5 p-15 will-change-transform lg:p-15">
    <div class="flex flex-col gap-5">
      <h3 class="light:text-(--color-white)">{{ projectName }}</h3>
      <p class="light:text-(--color-grey)">{{ projectDescription }}</p>
      <div class="hidden flex-wrap gap-2 lg:flex">
        <div v-for="(tag, index) in projectTags" :key="index" class="flex">
          <small class="light:text-(--color-white) rounded-4xl border border-solid border-white px-5 py-2.5">{{ getTagName(tag) }}</small>
        </div>
      </div>
    </div>
    <p class="light:text-(--color-white)">{{ projectText }}</p>
    <div class="flex flex-wrap gap-5 lg:gap-10">
      <a v-for="(link, index) in projectLinks" :key="index" class="anim-extrude light:bg-(--color-yellow) active flex w-fit px-5 py-2.5 lg:px-10 lg:py-5" :href="link.url" target="_blank">
        <p class="light:text-(--color-black) font-[Actay]">{{ link.name }}</p>
      </a>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  projectName: {
    type: String,
    required: true,
    default: "Default Title",
  },
  projectDescription: String,
  projectText: String,
  projectResult: String,
  projectStatistic: Array,
  projectLinks: {
    type: Array,
    default: () => [],
  },
  projectTags: {
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

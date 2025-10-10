<template>
  <div class="project light:bg-(--color-orange) project absolute top-0 left-0 col-span-1 flex h-full w-full flex-col gap-5 border-solid border-white will-change-transform">
    <div class="flex h-full flex-col gap-5 p-5 lg:justify-between lg:p-15">
      <div class="flex flex-col gap-5">
        <h3 class="light:text-(--color-white)">{{ projectName }}</h3>
        <p class="light:text-(--color-black)">{{ projectDescription }}</p>
        <div class="hidden flex-wrap gap-2 lg:flex">
          <div v-for="(tag, index) in projectTags" :key="index" class="flex">
            <small class="light:text-(--color-white) rounded-4xl border border-solid border-white px-5 py-2.5">{{ getTagName(tag) }}</small>
          </div>
        </div>
      </div>
      <p class="light:text-(--color-white)">{{ projectText }}</p>
      <div class="flex flex-wrap gap-2">
        <a v-for="(link, index) in projectLinks" :key="index" class="light:bg-(--color-white) active flex w-fit rounded-full px-5 py-2.5 lg:px-10 lg:py-5" :href="link.url" target="_blank">
          <p class="light:text-(--color-black)">{{ link.name }}</p>
        </a>
      </div>
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

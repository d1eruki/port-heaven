<template>
  <div class="project light:bg-[var(--white)] project absolute col-span-1 flex h-dvh w-full flex-col gap-5 rounded-4xl border border-solid border-black will-change-transform">
    <div class="flex h-full flex-col justify-between gap-5 p-5 lg:p-15">
      <div class="flex flex-col gap-5">
        <h3 class="light:text-[color:var(--black)] lg:w-[80%]">{{ projectName }}</h3>
        <p class="light:text-[color:var(--grey)]">{{ projectDescription }}</p>
        <div class="flex flex-wrap gap-2">
          <div v-for="(tag, index) in projectTags" :key="index" class="flex">
            <small class="light:text-[color:var(--black)] rounded-4xl border border-solid border-black px-5 py-2.5">{{ getTagName(tag) }}</small>
          </div>
        </div>
      </div>
      <p class="light:text-[color:var(--black)]">{{ projectText }}</p>
      <div class="flex gap-2">
        <a v-for="(link, index) in projectLinks" :key="index" class="light:bg-[var(--black)] active flex w-fit rounded-full px-10 py-5" :href="link.url" target="_blank">
          <p class="light:text-[color:var(--white)]">{{ link.name }}</p>
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

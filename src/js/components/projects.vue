<template>
  <div class="item light:bg-[var(--white)] project absolute col-span-1 flex w-full flex-col gap-5 rounded-4xl border border-solid border-black will-change-transform">
    <div class="flex h-full flex-col justify-between gap-5 p-15">
      <div class="flex gap-5 flex-col">
        <h3 class="lg:w-[80%] light:text-[color:var(--black)]">{{ projectName }}</h3>
        <p class="light:text-[color:var(--grey)]">{{ projectDescription }}</p>
      </div>
      <p class="light:text-[color:var(--black)]">{{ projectText }}</p>
      <div class="flex flex-wrap gap-2">
        <div v-for="(tag, index) in projectTags" :key="index" class="active custom-button flex w-fit">
          <p class="w-fit light:text-[color:var(--black)] border border-solid border-black rounded-4xl px-5">{{ getTagName(tag) }}</p>
        </div>
      </div>
      <div class="flex">
        <a v-for="(link, index) in projectLinks" :key="index" class="active custom-button flex w-full" :href="link.url" target="_blank">
          <p class="w-fit">{{ link.name }}</p>
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
  if (typeof tag === 'string' || typeof tag === 'number') return String(tag);
  if (typeof tag === 'object') {
    return tag.name || tag.label || tag.title || '';
  }
  return '';
}
</script>

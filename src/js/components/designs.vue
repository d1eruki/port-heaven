<template>
  <a :href="designUrl" target="_blank" class="group relative light:bg-[var(--black)] design active z-10 row-span-1 grid h-full flex-col justify-center gap-5 rounded-4xl p-10 hover:z-100 hover:items-start hover:justify-between lg:min-h-[400px] lg:items-center">
    <h4 class="light:text-[color:var(--white)]">{{ designName }}</h4>
    <p class="block self-end lg:hidden lg:group-hover:block">{{ designDesc }}</p>
    <div class="absolute left-10 right-10 flex flex-wrap gap-2 self-end lg:flex lg:group-hover:hidden">
      <div v-for="(tag, index) in designTags" :key="index" class="flex">
        <small class="light:text-[color:var(--grey)] light:border-[color:var(--grey)] rounded-4xl border border-solid px-5 py-2.5">{{ getTagName(tag) }}</small>
      </div>
    </div>
  </a>
</template>

<script setup>
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

function getTagName(tag) {
  if (tag == null) return "";
  if (typeof tag === "string" || typeof tag === "number") return String(tag);
  if (typeof tag === "object") {
    return tag.name || tag.label || tag.title || "";
  }
  return "";
}
</script>

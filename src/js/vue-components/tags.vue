<template>
  <div class="flex flex-wrap gap-2">
    <div v-for="(tag, index) in tags" :key="index" class="flex">
      <small class="light:text-neutral-500 light:bg-neutral-800 flex gap-1 rounded-4xl px-2 py-1.5">
        <span v-if="showIcons && isAdaptive(tag)" class="icon-[ic--baseline-phone-android]"></span>
        <span v-if="showIcons && isDesktop(tag)" class="icon-[ic--baseline-monitor]"></span>
        {{ getTagName(tag) }}
      </small>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  tags: {
    type: Array,
    default: () => [],
  },
  showIcons: {
    type: Boolean,
    default: false,
  },
});

const isAdaptive = (tag) => (getTagName(tag) || "").toLowerCase().includes("adaptive");
const isDesktop = (tag) => (getTagName(tag) || "").toLowerCase().includes("desktop");

function getTagName(tag) {
  if (tag == null) return "";
  if (typeof tag === "string" || typeof tag === "number") return String(tag);
  if (typeof tag === "object") {
    return tag.name || tag.label || tag.title || "";
  }
  return "";
}
</script>

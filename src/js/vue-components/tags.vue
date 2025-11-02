<template>
  <div class="hidden flex-wrap gap-2 lg:flex">
    <div v-for="(tag, index) in tags" :key="index" class="flex">
      <small class="light:text-neutral-500 light:bg-neutral-800 rounded-4xl px-2 py-1.5">{{ getTagName(tag) }}</small>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  tags: {
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

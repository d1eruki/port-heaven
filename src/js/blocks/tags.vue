<template>
  <div class="flex flex-wrap gap-2">
    <div
      v-for="(tag, index) in tags"
      :key="index"
      class="flex"
    >
      <small class="flex gap-1 rounded-4xl bg-chip px-2 py-1.5 text-chip-fg">
        <span
          v-if="showIcons && getTagIconClass(tag)"
          :class="getTagIconClass(tag)"
          aria-hidden="true"
        ></span>
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

const tagIconClassByName = {
  monitor: "icon-[ic--baseline-monitor]",
  phone: "icon-[ic--baseline-phone-android]",
};

function getTagName(tag) {
  if (tag == null) return "";
  if (typeof tag === "string" || typeof tag === "number") return String(tag);
  if (typeof tag === "object") {
    return tag.name || tag.label || tag.title || "";
  }
  return "";
}

function getTagIconClass(tag) {
  if (!tag || typeof tag !== "object") return "";

  return tagIconClassByName[tag.icon] || "";
}
</script>

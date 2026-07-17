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
  figma: "icon-[simple-icons--figma]",
  bootstrap: "icon-[simple-icons--bootstrap]",
  "ux/ui": "icon-[ic--baseline-web]",
  design: "icon-[ic--baseline-palette]",
  adaptive: "icon-[ic--baseline-devices]",
  prototype: "icon-[ic--baseline-account-tree]",
  frontend: "icon-[ic--baseline-code]",
  testing: "icon-[ic--baseline-bug-report]",
  desktop: "icon-[ic--baseline-desktop-windows]",
  "mobile app": "icon-[ic--baseline-phone-android]",
  visual: "icon-[ic--baseline-palette]",
  "team work": "icon-[ic--baseline-groups]",
  concept: "icon-[ic--baseline-lightbulb]",
  redesign: "icon-[ic--baseline-published-with-changes]",
  dashboard: "icon-[ic--baseline-dashboard]",
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
  const iconName = typeof tag === "object" && tag !== null ? tag.icon : "";
  const tagName = getTagName(tag).toLowerCase();

  return tagIconClassByName[iconName] || tagIconClassByName[tagName] || "";
}
</script>

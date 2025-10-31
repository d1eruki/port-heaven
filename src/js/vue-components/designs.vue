<template>
  <a :href="designUrl" target="_blank" class="light:hover:bg-primary group light:text-white light:hover:text-black">
    <div class="anim-extrude relative z-10 grid gap-5 p-15 hover:z-50 lg:h-[50dvh] lg:items-center">
      <h4 class="flex gap-3">
        {{ designName }}
      </h4>
      <div class="top-75 right-15 bottom-15 left-15 flex flex-wrap gap-5 self-end opacity-100 transition-all duration-100 ease-in-out lg:absolute lg:flex lg:group-hover:opacity-0">
        <div v-for="(tag, index) in designTags" :key="index" class="light:text-neutral-500 flex gap-2.5">
          <small class="flex gap-2.5">
            <span v-if="isAdaptiveLanding(tag)" class="icon-[ic--baseline-phone-android]"></span>
            <span v-if="isDesktopLanding(tag)" class="icon-[ic--baseline-monitor]"></span>
            {{ getTagName(tag) }}
          </small>
        </div>
      </div>
      <p class="right-15 bottom-15 left-15 block self-end transition-all duration-100 ease-in-out lg:absolute lg:opacity-0 lg:group-hover:opacity-100">{{ designDesc }}</p>
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

const isAdaptiveLanding = (tag) => (getTagName(tag) || "").toLowerCase().includes("adaptive landing");
const isDesktopLanding = (tag) => (getTagName(tag) || "").toLowerCase().includes("desktop landing");

function getTagName(tag) {
  if (tag == null) return "";
  if (typeof tag === "string" || typeof tag === "number") return String(tag);
  if (typeof tag === "object") {
    return tag.name || tag.label || tag.title || "";
  }
  return "";
}
</script>

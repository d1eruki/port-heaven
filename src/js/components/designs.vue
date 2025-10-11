<template>
  <a :href="designUrl" target="_blank" class="group design relative z-10 grid gap-5 p-10 hover:z-100 lg:h-[50dvh] lg:items-center">
    <h4 class="light:text-(--color-white) flex gap-3 group-hover:lg:text-(--color-black)">{{ designName }}</h4>
    <div class="top-75 right-10 bottom-10 left-10 flex flex-wrap gap-5 self-end lg:absolute lg:flex lg:group-hover:hidden">
      <div v-for="(tag, index) in designTags" :key="index" class="light:text-(--color-grey) flex gap-2.5">
        <small class="flex gap-2.5">
          <span v-if="isAdaptiveLanding(tag)" class="icon-[fa7-solid--mobile-screen]"></span>
          <span v-if="isDesktopLanding(tag)" class="icon-[fa7-solid--display]"></span>
          {{ getTagName(tag) }}
        </small>
      </div>
    </div>
    <p class="right-10 bottom-10 left-10 block self-end lg:absolute lg:hidden lg:group-hover:block">{{ designDesc }}</p>
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

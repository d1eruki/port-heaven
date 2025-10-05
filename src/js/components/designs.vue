<template>
  <a :href="designUrl" target="_blank" class="group light:bg-[var(--black)] design active relative z-10 grid h-125 gap-5 rounded-4xl p-10 hover:z-100 lg:items-center">
    <h4 class="light:text-[color:var(--white)] flex gap-3">{{ designName }}</h4>
    <p class="right-10 bottom-10 left-10 block self-end lg:absolute lg:hidden lg:group-hover:block">{{ designDesc }}</p>
    <div class="right-10 bottom-10 left-10 flex flex-wrap gap-2 self-end lg:absolute lg:flex lg:group-hover:hidden">
      <div v-for="(tag, index) in designTags" :key="index" class="flex light:text-[color:var(--grey)] light:border-[color:var(--grey)] rounded-4xl border border-solid px-5 py-2.5">
        <small class="">
          <span v-if="adaptiveLanding" class="icon-[fa7-solid--mobile-screen]"></span>
          <span v-if="desktopLanding" class="icon-[fa7-solid--display]"></span>
          {{ getTagName(tag) }}

        </small>
      </div>
    </div>
  </a>
</template>

<script setup>
import { computed } from "vue";

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

const adaptiveLanding = computed(() => props.designTags.some((tag) => (getTagName(tag) || "").toLowerCase().includes('adaptive landing')));
const desktopLanding = computed(() => props.designTags.some((tag) => (getTagName(tag) || "").toLowerCase().includes('desktop landing')));

function getTagName(tag) {
  if (tag == null) return "";
  if (typeof tag === "string" || typeof tag === "number") return String(tag);
  if (typeof tag === "object") {
    return tag.name || tag.label || tag.title || "";
  }
  return "";
}
</script>

<template>
  <div class="vanilla-tilt-creatives group h-fit hover:z-100" :style="computedStyle">
    <video class="transition-all duration-1000 ease-in-out lg:grayscale lg:group-hover:grayscale-0" :src="creativeSrc" controls />
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  creativeSrc: { type: String, required: true },
  row: { type: [Number, String], required: true, default: 1 },
  rowSpan: { type: Number, default: 1 },
  col: { type: [Number, String], required: true, default: 1 },
  colSpan: { type: Number, default: 1 },
});

const computedStyle = computed(() => ({
  ...(props.row && { gridRow: `${props.row} / span ${props.rowSpan}` }),
  ...(props.col && { gridColumn: `${props.col} / span ${props.colSpan}` }),
}));
</script>

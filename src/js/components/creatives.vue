<template>
  <div class="card-rotate vanilla-tilt h-fit" :style="computedStyle">
    <img class="card-rotate-face backface-hidden" :src="creativeSrc" alt="post-card" />
    <div class="card-rotate-shirt light:bg-(--color-black) absolute top-0 h-full w-full backface-hidden">
      <fieldset class="absolute top-0 w-full">
        <legend>вредина</legend>
      </fieldset>
      <fieldset class="absolute top-[100%] w-full origin-top-right rotate-90">
        <legend>негодяй</legend>
      </fieldset>
      <fieldset class="absolute bottom-0 w-full rotate-180">
        <legend>злюка</legend>
      </fieldset>
      <fieldset class="absolute top-[100%] w-full origin-top-left -rotate-90">
        <legend>лиходей</legend>
      </fieldset>
    </div>
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

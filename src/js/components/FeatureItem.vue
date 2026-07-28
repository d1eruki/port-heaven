<template>
  <div
    class="relative z-2 grid min-h-fit min-w-0 max-w-full grid-rows-[auto_1fr] gap-10 overflow-hidden rounded-3xl bg-canvas p-10 text-left lg:min-h-full"
  >
    <p class="min-w-0 max-w-full wrap-anywhere">{{ title }}</p>
    <div class="grid w-full min-w-0 max-w-full content-end gap-5 overflow-hidden">
      <span
        :data-target="dataTarget"
        class="inline-flex w-full min-w-0 max-w-full items-baseline gap-[0.1em] font-heading text-feature-stat font-black text-stat lg:font-bold"
      >
        <small
          v-if="statPrefix"
          class="font-heading! text-fg"
        >
          {{ statPrefix }}
        </small>
        <span
          :data-target="dataTarget"
          class="font-heading! whitespace-nowrap tabular-nums [&_.odometer-last-value]:w-full"
          :class="{ counter: isCounter }"
        >
          {{ displayValue }}
        </span>
        <span
          v-if="suffix"
          :class="{ 'text-heading-md': statSuffix }"
        >
          {{ suffix }}
        </span>
      </span>
      <p class="w-full min-w-0 max-w-full wrap-anywhere">{{ text }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  isCounter: {
    type: Boolean,
    default: false,
  },
  statPrefix: {
    type: String,
    default: "",
  },
  statSuffix: {
    type: String,
    default: "",
  },
  dataTarget: {
    type: [String, Number],
  },
  text: {
    type: String,
    required: true,
    default: "default text",
  },
});

const displayValue =
  typeof props.dataTarget === "string"
    ? props.dataTarget.replace(/\D/g, "") || props.dataTarget
    : props.dataTarget;
const suffix =
  props.statSuffix ||
  (typeof props.dataTarget === "string" ? props.dataTarget.replace(/[\d\s]/g, "") : "");
</script>

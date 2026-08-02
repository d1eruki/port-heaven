<template>
  <div
    class="relative z-2 grid min-h-fit max-w-full min-w-0 grid-rows-[auto_1fr] gap-10 overflow-hidden rounded-3xl bg-canvas p-10 text-left lg:min-h-full"
  >
    <p class="max-w-full min-w-0 wrap-anywhere">{{ title }}</p>
    <div class="grid w-full max-w-full min-w-0 content-end gap-5 overflow-hidden">
      <span
        ref="counterRoot"
        class="inline-flex w-full max-w-full min-w-0 items-baseline gap-[0.1em] font-heading text-feature-stat font-black text-accent lg:font-bold"
      >
        <small
          v-if="statPrefix"
          class="font-heading! text-primary"
        >
          {{ statPrefix }}
        </small>
        <NumberFlow
          v-if="animatedCounter"
          :value="counterValue"
          :trend="1"
          :plugins="counterPlugins"
          :transform-timing="counterTransformTiming"
          :spin-timing="counterSpinTiming"
          :opacity-timing="counterOpacityTiming"
          class="font-heading! whitespace-nowrap tabular-nums [--number-flow-mask-height:0px] [--number-flow-mask-width:0px]"
        />
        <span
          v-else
          class="font-heading! whitespace-nowrap tabular-nums"
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
      <p class="w-full max-w-full min-w-0 wrap-anywhere">{{ text }}</p>
    </div>
  </div>
</template>

<script setup>
import NumberFlow, { continuous } from "@number-flow/vue";
import { useIntersectionObserver } from "@vueuse/core";
import { onMounted, ref } from "vue";
import { effectsEnabled } from "../features/preferences/effects-toggle";

const counterPlugins = [continuous];
const counterTransformTiming = { duration: 0 };
const counterSpinTiming = {
  duration: 800,
  easing: "cubic-bezier(0.23, 1, 0.32, 1)",
};
const counterOpacityTiming = { duration: 0 };

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

const counterRoot = ref(null);
const counterValue = ref(0);
const animatedCounter = ref(false);

const showTargetValue = () => {
  counterValue.value = parseInt(displayValue, 10) || 0;
};

const { isSupported, resume, stop } = useIntersectionObserver(
  counterRoot,
  ([entry]) => {
    if (!entry?.isIntersecting) return;

    showTargetValue();
    stop();
  },
  {
    immediate: false,
    threshold: [0, 0.9],
  },
);

onMounted(() => {
  queueMicrotask(() => {
    if (!props.isCounter || !effectsEnabled.value) {
      stop();
      return;
    }

    animatedCounter.value = true;

    if (isSupported.value) resume();
    else showTargetValue();
  });
});
</script>

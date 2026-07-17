<template>
  <div
    class="relative z-2 grid min-h-fit justify-between gap-15 p-15 lg:min-h-full lg:gap-20 lg:p-15 xl:grid-rows-[1fr_auto]"
  >
    <span
      :data-target="dataTarget"
      class="text-feature-stat inline-flex w-fit items-baseline gap-[0.1em] font-heading font-black text-stat lg:font-bold"
    >
      <span
        :data-target="dataTarget"
        class="font-heading! whitespace-nowrap tabular-nums [&_.odometer-last-value]:w-full"
        :class="{ counter: isCounter }"
      >
        {{ displayValue }}
      </span>
      <span v-if="suffix">{{ suffix }}</span>
    </span>
    <p>{{ text }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  isCounter: {
    type: Boolean,
    default: false,
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
const suffix = typeof props.dataTarget === "string" ? props.dataTarget.replace(/[\d\s]/g, "") : "";
</script>

<template>
  <div
    class="relative z-2 grid min-h-fit flex-1 justify-between gap-15 p-15 dark:border-neutral-800 lg:min-h-full lg:gap-20 lg:border-l-1 lg:p-15 xl:[grid-template-rows:auto_1fr_auto]"
  >
    <small class="dark:text-white">{{ title }}</small>
    <span
      :id="idAttr"
      :data-target="dataTarget"
      class="inline-flex w-fit items-baseline gap-[0.08em] text-[8rem] font-black dark:text-primary lg:text-9xl lg:font-bold"
    >
      <span
        :data-target="dataTarget"
        :class="idAttr"
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
  idAttr: {
    type: String,
  },
  dataTarget: {
    type: [String, Number],
  },
  title: {
    type: String,
  },
  text: {
    type: String,
    required: true,
    default: "default text",
  },
});

const displayValue =
  typeof props.dataTarget === "string"
    ? props.dataTarget.replace(/[^\d]/g, "") || props.dataTarget
    : props.dataTarget;
const suffix = typeof props.dataTarget === "string" ? props.dataTarget.replace(/[\d\s]/g, "") : "";
</script>

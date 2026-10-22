<template>
  <component
    :is="isLink ? 'a' : 'button'"
    :href="isLink ? href : undefined"
    :target="isLink ? '_blank' : undefined"
    :rel="isLink ? 'noopener noreferrer' : undefined"
    :type="isLink ? undefined : type"
    :class="buttonClasses"
  >
    <small
      v-if="variant === 'secondary'"
      class="opacity-0 group-hover:opacity-100"
      aria-hidden="true"
    >
      /
    </small>
    <small v-if="size === 'compact'"><slot /></small>
    <span v-else>
      <slot />
    </span>
  </component>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  href: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "button",
  },
  variant: {
    type: String,
    default: "primary",
    validator: (value) => ["primary", "secondary"].includes(value),
  },
  size: {
    type: String,
    default: "default",
    validator: (value) => ["default", "compact"].includes(value),
  },
  tone: {
    type: String,
    default: "inverse",
    validator: (value) => ["inverse", "control"].includes(value),
  },
});

const classesByVariantAndSize = {
  primary: {
    default:
      "anim-extrude active flex w-full justify-center rounded-full px-5 py-5 text-center lg:w-fit lg:px-10",
    compact: "anim-extrude active rounded-full px-5 py-2.5",
  },
  secondary: {
    default: "group flex items-center",
    compact: "group flex items-center",
  },
};

const primarySurfaceClasses =
  "bg-linear-to-b from-[color-mix(in_srgb,var(--color-accent),white_15%)] via-accent via-45% to-[color-mix(in_srgb,var(--color-accent),black_35%)] text-on-accent shadow-xl shadow-accent/25 ring-1 ring-inset ring-white/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";

const secondaryClassesByTone = {
  inverse: "text-action-secondary hover:text-on-inverse",
  control: "text-link hover:text-link-hover",
};

const isLink = computed(() => Boolean(props.href));
const buttonClasses = computed(() => [
  "font-heading",
  classesByVariantAndSize[props.variant][props.size],
  props.variant === "primary" ? primarySurfaceClasses : undefined,
  props.variant === "secondary" ? secondaryClassesByTone[props.tone] : undefined,
]);
</script>

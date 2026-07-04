<template>
  <component :is="currentShell" />
</template>

<script setup>
import { computed, nextTick, watch } from "vue";
import DefaultShell from "./variants/layouts/DefaultShell.vue";
import LancetShell from "./variants/lancet/LancetShell.vue";
import { currentVariant } from "./features/preferences/variant-toggle";
import { getVariantShell } from "./variants/registry";

const shells = {
  default: DefaultShell,
  lancet: LancetShell,
};

const currentShell = computed(() => shells[getVariantShell(currentVariant.value)] || DefaultShell);

watch(
  currentVariant,
  async (variant) => {
    await nextTick();
    window.dispatchEvent(new CustomEvent("variant:layout-ready", { detail: { variant } }));
  },
  { immediate: true },
);
</script>

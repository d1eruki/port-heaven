<template>
  <LancetShell v-if="currentVariant === LANCET_VARIANT" />
  <DefaultShell v-else />
</template>

<script setup>
import { nextTick, watch } from "vue";
import DefaultShell from "./variants/layouts/DefaultShell.vue";
import LancetShell from "./variants/lancet/LancetShell.vue";
import { currentVariant, LANCET_VARIANT } from "./features/preferences/variant-toggle";

watch(
  currentVariant,
  async (variant) => {
    await nextTick();
    window.dispatchEvent(new CustomEvent("variant:layout-ready", { detail: { variant } }));
  },
  { immediate: true },
);
</script>

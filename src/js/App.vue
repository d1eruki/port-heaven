<template>
  <LancetShell v-if="currentVariant === 'lancet'" />
  <DefaultShell v-else />
</template>

<script setup>
import { nextTick, watch } from "vue";
import DefaultShell from "./variants/layouts/DefaultShell.vue";
import LancetShell from "./variants/lancet/LancetShell.vue";
import { currentVariant } from "./features/preferences/variant-toggle";

watch(
  currentVariant,
  async (variant) => {
    await nextTick();
    window.dispatchEvent(new CustomEvent("layoutchange", { detail: { variant } }));
  },
  { immediate: true },
);
</script>

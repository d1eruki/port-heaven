<template>
  <section
    id="reviews"
    data-section="reviews"
    class="relative flex min-h-svh bg-canvas p-10 text-primary lg:p-15"
  >
    <div
      class="grid w-full flex-1 place-items-center overflow-hidden rounded-4xl bg-surface-subtle p-10 lg:p-15"
    >
      <h2 class="text-center lowercase">{{ t("menu.reviews.title") }}</h2>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

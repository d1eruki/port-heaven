<template>
  <section
    data-section="description"
    id="description"
    class="relative bg-accent lg:grid lg:min-h-dvh lg:grid-cols-2"
  >
    <div
      class="z-2 content-center px-15 pt-15 text-on-accent lg:justify-center lg:bg-transparent lg:pb-15"
    >
      <h2 class="lg:justify-self-center">{{ t("menu.description.title") }}</h2>
    </div>
    <p class="z-2 self-center p-15 text-on-accent lg:h-fit lg:w-150">
      {{ t("menu.description.text") }}
    </p>
  </section>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

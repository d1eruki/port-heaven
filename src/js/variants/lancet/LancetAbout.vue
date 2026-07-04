<template>
  <section
    data-section="about"
    id="about"
    class="grid grid-cols-1 lg:ml-50 lg:min-h-dvh lg:auto-rows-fr lg:grid-cols-2"
  >
    <h2
      class="glow-lg col-span-1 w-full p-10 lg:sticky lg:top-0 lg:h-dvh lg:content-center lg:text-center"
    >
      {{ t("menu.about.title") }}
    </h2>
    <div class="corner-frame col-span-1 m-10 p-10 lg:self-end">
      <p>{{ t("menu.about.description") }}</p>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

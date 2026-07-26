<template>
  <section
    data-section="description"
    id="description"
    class="relative z-3 p-10 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-10 after:bg-canvas after:content-[''] lg:h-dvh lg:p-15 lg:after:h-15"
  >
    <div class="overflow-hidden rounded-4xl bg-accent lg:grid lg:h-full lg:grid-cols-2">
      <div
        class="z-2 content-center px-5 pt-5 text-on-accent lg:justify-center lg:bg-transparent lg:px-15 lg:pt-15 lg:pb-15"
      >
        <h2 class="lg:justify-self-center">{{ t("menu.description.title") }}</h2>
      </div>
      <p class="z-2 self-center p-5 text-on-accent lg:h-fit lg:w-150 lg:p-15">
        {{ t("menu.description.text") }}
      </p>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

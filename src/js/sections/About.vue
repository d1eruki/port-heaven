<template>
  <section
    data-section="about"
    id="about"
    class="relative flex min-h-screen flex-col content-center bg-canvas lg:justify-center lg:gap-15"
  >
    <div class="block px-10 pt-10 text-fg lg:sr-only lg:px-15 lg:pt-15">
      <h2>{{ t("menu.about.title") }}</h2>
    </div>
    <div class="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-15 lg:p-15">
      <FeatureItem
        is-counter
        data-target="2+"
        :text="t('menu.about.experience.text')"
      />
      <FeatureItem
        is-counter
        data-target="10+"
        :text="t('menu.about.projects.text')"
      />
      <FeatureItem :text="t('menu.about.hobbies.text')" />
    </div>
  </section>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import FeatureItem from "../components/FeatureItem.vue";

const { t } = useI18n();
</script>

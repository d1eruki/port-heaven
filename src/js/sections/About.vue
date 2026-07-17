<template>
  <section
    data-section="about"
    id="about"
    class="relative flex min-h-screen flex-col content-center bg-canvas lg:justify-center lg:gap-15"
  >
    <div class="block px-15 pt-15 text-fg lg:sr-only">
      <h2>{{ t("menu.about.title") }}</h2>
    </div>
    <div class="flex flex-col gap-15 lg:flex-row lg:p-15">
      <FeatureItem
        is-counter
        data-target="2+"
        :title="'/ ' + t('menu.about.experience.title')"
        :text="t('menu.about.experience.text')"
      />
      <FeatureItem
        is-counter
        data-target="10+"
        :title="'/ ' + t('menu.about.projects.title')"
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

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
    <img
      alt=""
      class="absolute right-0 bottom-20 z-1 hidden w-180 opacity-7.5 lg:block"
      :src="somaImage"
      loading="lazy"
      decoding="async"
    />
  </section>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import somaImage from "../../assets/soma.webp";
import FeatureItem from "../components/FeatureItem.vue";

const { t } = useI18n();
</script>

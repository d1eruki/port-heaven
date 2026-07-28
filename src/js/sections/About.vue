<template>
  <section
    data-section="about"
    id="about"
    class="relative z-3 flex min-h-svh p-10 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-10 after:bg-canvas after:content-[''] lg:p-15 lg:after:h-15"
  >
    <div class="grid w-full flex-1 overflow-hidden rounded-4xl bg-chip text-fg lg:grid-cols-2">
      <div class="flex flex-col justify-between gap-20 p-10 lg:p-15">
        <div class="grid gap-5">
          <h2>{{ t("menu.about.title") }}</h2>
          <p class="max-w-150">{{ t("menu.about.intro") }}</p>
        </div>
        <div class="grid max-w-150 gap-2">
          <p>{{ t("menu.about.hobbies.title") }}</p>
          <p class="text-muted">{{ t("menu.about.hobbies.text") }}</p>
        </div>
      </div>
      <div class="grid gap-2 p-2 lg:grid-cols-2">
        <FeatureItem
          is-counter
          data-target="2+"
          :title="t('menu.about.experience.title')"
          :text="t('menu.about.experience.text')"
        />
        <FeatureItem
          is-counter
          data-target="10+"
          :title="t('menu.about.projects.title')"
          :text="t('menu.about.projects.text')"
        />
        <FeatureItem
          class="lg:col-span-2"
          is-counter
          data-target="50"
          stat-suffix="/50"
          :title="t('menu.about.balance.title')"
          :text="t('menu.about.balance.text')"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import FeatureItem from "../components/FeatureItem.vue";

const { t } = useI18n();
</script>

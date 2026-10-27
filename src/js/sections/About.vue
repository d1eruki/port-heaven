<!-- Секция об авторе с вводным текстом и карточками показателей. -->
<template>
  <section
    data-section="about"
    id="about"
    class="relative z-3 flex min-h-svh p-section max-lg:pt-section-gap max-lg:pb-0"
  >
    <div
      class="relative isolate grid w-full flex-1 overflow-hidden rounded-4xl bg-surface-subtle text-primary before:pointer-events-none before:absolute before:inset-0 before:z-0 before:icon-[ic--baseline-star] before:block before:h-full before:w-full before:bg-current before:icon-pattern-checker before:text-icon-pattern before:opacity-20 before:content-[''] lg:grid-cols-2"
    >
      <div class="relative z-1 flex flex-col justify-between gap-content p-panel">
        <div class="grid gap-related">
          <h2 class="text-left">{{ t("menu.about.title") }}</h2>
          <p>{{ t("menu.about.intro") }}</p>
        </div>
        <div class="grid gap-related">
          <p>{{ t("menu.about.hobbies.title") }}</p>
          <p class="text-muted">{{ t("menu.about.hobbies.text") }}</p>
        </div>
      </div>
      <div class="relative z-1 grid gap-related p-panel lg:grid-cols-2">
        <FeatureItem
          data-about-feature
          is-counter
          data-target="2+"
          :title="t('menu.about.experience.title')"
          :text="t('menu.about.experience.text')"
        />
        <FeatureItem
          data-about-feature
          is-counter
          data-target="10+"
          :title="t('menu.about.projects.title')"
          :text="t('menu.about.projects.text')"
        />
        <FeatureItem
          data-about-feature
          class="lg:col-span-2"
          is-counter
          data-target="50"
          stat-suffix="/50"
          :title="t('menu.about.balance.title')"
          :text="t('menu.about.balance.text')"
        />
      </div>
    </div>
    <picture
      class="pointer-events-none absolute -top-3 right-10 block w-20 select-none lg:top-1/2 lg:right-1/2 lg:mr-15 lg:w-64 lg:-translate-y-1/2"
      aria-hidden="true"
    >
      <source
        v-for="source in chromeLoop.sources"
        :key="source.type"
        :type="source.type"
        :srcset="source.srcset"
        sizes="(min-width: 1024px) 256px, 80px"
      />
      <img
        :src="chromeLoop.src"
        alt=""
        :width="chromeLoop.width"
        :height="chromeLoop.height"
        loading="lazy"
        decoding="async"
        draggable="false"
        class="block h-auto w-full -rotate-12"
      />
    </picture>
  </section>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import FeatureItem from "../components/FeatureItem.vue";
import chromeLoop from "../../assets/chrome/chrome-loop.png?responsive";

const { t } = useI18n();
</script>

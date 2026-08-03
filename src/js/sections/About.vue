<template>
  <section
    data-section="about"
    id="about"
    class="relative z-3 flex min-h-svh p-10 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-10 after:bg-canvas after:content-[''] lg:p-15 lg:after:h-15"
  >
    <div
      class="relative isolate grid w-full flex-1 overflow-hidden rounded-4xl bg-surface-subtle text-primary before:pointer-events-none before:absolute before:inset-0 before:z-0 before:icon-[ic--baseline-star] before:block before:h-full before:w-full before:bg-current before:icon-pattern-checker before:text-icon-pattern before:opacity-20 before:content-[''] lg:grid-cols-2"
    >
      <div class="relative z-1 flex flex-col justify-between gap-20 p-10 lg:p-15">
        <div class="relative z-1 grid gap-5">
          <h2>{{ t("menu.about.title") }}</h2>
          <p class="max-w-150">{{ t("menu.about.intro") }}</p>
        </div>
        <component
          :is="'model-viewer'"
          data-3d-badge
          data-cursor-label=""
          :src="badgeModelUrl"
          class="pointer-events-auto hidden h-1/2 w-full shrink-0 effects:lg:block"
          camera-controls
          interaction-prompt="none"
          camera-orbit="0deg 90deg auto"
          min-camera-orbit="auto 90deg auto"
          max-camera-orbit="auto 90deg auto"
          disable-zoom
          disable-pan
          auto-rotate
          auto-rotate-delay="0"
          rotation-per-second="10deg"
          shadow-intensity="0"
          autoplay
          exposure="1"
          aria-label="3D badge"
          @load="hideModelViewerCursor"
        />
        <div class="relative z-1 grid max-w-150 gap-2">
          <p>{{ t("menu.about.hobbies.title") }}</p>
          <p class="text-muted">{{ t("menu.about.hobbies.text") }}</p>
        </div>
      </div>
      <div class="relative z-1 grid gap-2 p-2 lg:grid-cols-2">
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
  </section>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import badgeModelUrl from "../../assets/tag.glb";
import FeatureItem from "../components/FeatureItem.vue";

const { t } = useI18n();

const hideModelViewerCursor = ({ currentTarget }) => {
  const shadowRoot = currentTarget.shadowRoot;
  if (!shadowRoot || shadowRoot.querySelector("[data-app-cursor-style]")) return;

  const style = document.createElement("style");
  style.dataset.appCursorStyle = "";
  style.textContent = ".userInput { cursor: none !important; }";
  shadowRoot.append(style);
};
</script>

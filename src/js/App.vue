<template>
  <AppControls />

  <div id="smooth-wrapper">
    <div
      id="smooth-content"
      class="w-full max-w-full min-w-0"
    >
      <main class="w-full max-w-full min-w-0">
        <Hero :current-theme="currentTheme" />

        <header
          class="sticky top-0 z-100 hidden h-10 w-full items-center bg-accent px-10 text-on-accent lg:h-15 lg:px-15 no-effects:flex"
        >
          {{ t("notices.effectsDisabled") }}
        </header>

        <About />
        <Projects />
        <Design />
        <Creatives />
        <Pricing />
      </main>
      <Footer />
    </div>
  </div>
  <Notification
    :is-visible="analyticsConsent === null"
    @accept="acceptAnalytics"
    @decline="declineAnalytics"
  />
</template>

<script setup>
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import AppControls from "./components/AppControls.vue";
import Notification from "./components/Notification.vue";
import Hero from "./sections/Hero.vue";
import About from "./sections/About.vue";
import Projects from "./sections/Projects.vue";
import Design from "./sections/Design.vue";
import Creatives from "./sections/Creatives.vue";
import Pricing from "./sections/Pricing.vue";
import Footer from "./sections/Footer.vue";
import { currentTheme } from "./features/preferences/theme-toggle";
import { useValidatedStorage } from "./features/preferences/storage";
import { initYandexMetrika } from "./libraries/yandex-metrika";

const { t } = useI18n();
const ANALYTICS_CONSENT_STORAGE_KEY = "analytics-consent";
const isSupportedAnalyticsConsent = (value) => value === "accepted" || value === "declined";
const analyticsConsent = useValidatedStorage({
  key: ANALYTICS_CONSENT_STORAGE_KEY,
  fallback: null,
  isValid: isSupportedAnalyticsConsent,
});

const saveAnalyticsConsent = (value) => {
  analyticsConsent.value = value;
};

const acceptAnalytics = () => {
  saveAnalyticsConsent("accepted");
  initYandexMetrika();
};

const declineAnalytics = () => {
  saveAnalyticsConsent("declined");
};

onMounted(() => {
  if (analyticsConsent.value === "accepted") initYandexMetrika();
});
</script>

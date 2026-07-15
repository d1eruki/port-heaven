<template>
  <AppControls />

  <main>
    <Hero />
    <Description />

    <header
      class="sticky top-0 z-100 hidden h-fit min-h-10 w-full bg-accent-section px-15 py-5 text-accent-section-fg no-effects:flex"
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
  <Notification
    :is-visible="analyticsConsent === null"
    @accept="acceptAnalytics"
    @decline="declineAnalytics"
  />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import AppControls from "./components/AppControls.vue";
import Notification from "./components/Notification.vue";
import Hero from "./sections/Hero.vue";
import Description from "./sections/Description.vue";
import About from "./sections/About.vue";
import Projects from "./sections/Projects.vue";
import Design from "./sections/Design.vue";
import Creatives from "./sections/Creatives.vue";
import Pricing from "./sections/Pricing.vue";
import Footer from "./sections/Footer.vue";
import { initYandexMetrika } from "./libraries/yandex-metrika";
import { readStorageValue, saveStorageValue } from "./utils/storage";

const { t } = useI18n();
const ANALYTICS_CONSENT_STORAGE_KEY = "analytics-consent";
const isSupportedAnalyticsConsent = (value) => value === "accepted" || value === "declined";
const analyticsConsent = ref(
  readStorageValue({
    key: ANALYTICS_CONSENT_STORAGE_KEY,
    fallback: null,
    isValid: isSupportedAnalyticsConsent,
  }),
);

const saveAnalyticsConsent = (value) => {
  analyticsConsent.value = value;
  saveStorageValue({
    key: ANALYTICS_CONSENT_STORAGE_KEY,
    value,
    isValid: isSupportedAnalyticsConsent,
  });
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

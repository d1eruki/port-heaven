<!-- Корневая страница портфолио с управлением, секциями и согласием на аналитику. -->
<template>
  <AppControls ref="controlsRef" />

  <div id="smooth-wrapper">
    <div
      id="smooth-content"
      class="mx-auto w-full max-w-(--breakpoint-3xl) min-w-0"
    >
      <main class="w-full max-w-full min-w-0 max-lg:overflow-x-clip">
        <Hero
          ref="heroRef"
          :current-theme="currentTheme"
          @intro-ready="isHeroIntroReady = true"
        />

        <header
          class="sticky top-0 z-100 hidden h-10 w-full items-center bg-accent px-10 text-on-accent lg:h-15 lg:px-15 no-effects:flex"
        >
          {{ t("notices.effectsDisabled") }}
        </header>

        <div class="flex min-w-0 flex-col lg:gap-section-gap">
          <About />
          <Projects />
          <Design />
          <Creatives />
          <Reviews />
        </div>
      </main>
      <Footer class="lg:mt-section-gap" />
    </div>
  </div>
  <Notification
    :is-visible="analyticsConsent === null"
    @accept="acceptAnalytics"
    @decline="declineAnalytics"
  />
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useDocumentVisibility, useElementVisibility, useMediaQuery } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import AppControls from "./components/AppControls.vue";
import Notification from "./components/Notification.vue";
import Hero from "./sections/Hero.vue";
import About from "./sections/About.vue";
import Projects from "./sections/Projects.vue";
import Design from "./sections/Design.vue";
import Creatives from "./sections/Creatives.vue";
import Reviews from "./sections/Reviews.vue";
import Footer from "./sections/Footer.vue";
import { currentTheme } from "./features/preferences/theme-toggle";
import { useValidatedStorage } from "./features/preferences/storage";
import { initYandexMetrika } from "./libraries/yandex-metrika";
import { gsap } from "./libraries/gsap-scroll";
import { getBreakpointPx } from "./utils/breakpoints";
import { effectsEnabled } from "./features/preferences/effects-toggle";

const { t } = useI18n();
const controlsRef = ref(null);
const heroRef = ref(null);
const isHeroIntroReady = ref(false);
const isMobileIntro = useMediaQuery(`(width < ${getBreakpointPx("lg")}px)`);
const documentVisibility = useDocumentVisibility();
const heroSection = computed(() => heroRef.value?.getIntroTargets().section ?? null);
const isHeroInView = useElementVisibility(heroSection);
let introContext;
let introTimeline;
let hasCompletedIntro = false;

watch(
  [isHeroIntroReady, isMobileIntro, effectsEnabled],
  ([ready, mobile, enabled]) => {
    introContext?.revert();
    introTimeline = undefined;
    if (!ready || !controlsRef.value || !heroRef.value) return;
    const { menu, dots } = controlsRef.value.getIntroTargets();
    const { name, character } = heroRef.value.getIntroTargets();
    introContext = gsap.context(() => {
      if (!mobile || !enabled || hasCompletedIntro || (!isHeroInView.value && window.scrollY > 0)) {
        gsap.set([menu, name], { autoAlpha: 1, y: 0, yPercent: 0 });
        gsap.set([character, dots], { autoAlpha: 1 });
        heroRef.value.completeIntro();
        hasCompletedIntro = true;
        return;
      }
      gsap.set(menu, { autoAlpha: 0, yPercent: -100 });
      gsap.set(name, { autoAlpha: 0, y: 40 });
      gsap.set([character, dots], { autoAlpha: 0 });
      introTimeline = gsap.timeline({
        paused: documentVisibility.value !== "visible" || !isHeroInView.value,
        defaults: { ease: "power3.out" },
        onComplete: () => {
          hasCompletedIntro = true;
          heroRef.value?.completeIntro();
        },
      })
        .to(menu, { autoAlpha: 1, yPercent: 0, duration: 0.5 })
        .to(name, { autoAlpha: 1, y: 0, duration: 0.4 })
        .addLabel("character")
        .call(() => heroRef.value?.revealCharacter(), [], "character")
        .to(character, { autoAlpha: 1, duration: 0.5 }, "character")
        .to(dots, { autoAlpha: 1, duration: 0.5 }, "character");
    });
  },
  { flush: "post" },
);

watch([documentVisibility, isHeroInView], ([visibility, visible]) => {
  if (!visible && window.scrollY > 0 && introTimeline) {
    introTimeline.progress(1).kill();
    introTimeline = undefined;
    return;
  }
  introTimeline?.paused(visibility !== "visible" || !visible);
});

onBeforeUnmount(() => introContext?.revert());

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

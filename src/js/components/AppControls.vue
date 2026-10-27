<!-- Общие элементы управления, навигация по секциям и индикатор прокрутки страницы. -->
<template>
  <div
    id="menu-dot"
    class="fixed top-0 left-[max(0px,calc((100%-var(--breakpoint-3xl))/2))] z-50 flex min-h-svh w-10 items-center justify-center text-app-controls mix-blend-difference transition-opacity duration-300 ease-in-out lg:w-15"
  >
    <TooltipProvider
      :delay-duration="0"
      :skip-delay-duration="0"
    >
      <nav
        ref="sectionNavRef"
        data-section-nav
        class="flex w-fit shrink-0 items-center gap-5 max-lg:-rotate-90 max-lg:flex-row-reverse lg:flex-col"
        :aria-label="t('navigation.label')"
      >
        <TooltipRoot
          v-for="section in sectionNavItems"
          :key="section.id"
        >
          <TooltipTrigger as-child>
            <button
              type="button"
              class="dot group max-lg:relative max-lg:flex max-lg:h-10 max-lg:w-auto max-lg:min-w-[var(--dot-size)] max-lg:shrink-0 max-lg:items-center max-lg:justify-center max-lg:rounded-full max-lg:focus-visible:outline-2 max-lg:focus-visible:outline-offset-2 max-lg:focus-visible:outline-current effects:max-lg:transition-all effects:max-lg:duration-300 effects:max-lg:ease-in-out"
              :data-target="`#${section.id}`"
              :aria-label="t(section.labelKey)"
              aria-current="false"
            >
              <svg
                class="max-lg:absolute max-lg:size-[var(--dot-size)] max-lg:group-aria-current:opacity-0 effects:max-lg:transition-opacity effects:max-lg:duration-300 effects:max-lg:ease-in-out"
                viewBox="0 0 20 20"
                aria-hidden="true"
                focusable="false"
              >
                <circle
                  class="fill-current opacity-25 group-aria-current:opacity-100"
                  cx="10"
                  cy="10"
                  r="6"
                />
              </svg>
              <span
                aria-hidden="true"
                class="flex h-2 min-w-[var(--dot-size)] items-center justify-center overflow-hidden rounded-full bg-current opacity-0 group-aria-current:h-8 group-aria-current:px-3 group-aria-current:opacity-100 lg:hidden effects:transition-all effects:duration-300 effects:ease-in-out"
              >
                <small
                  class="max-w-0 overflow-hidden font-heading whitespace-nowrap text-[color:var(--semantic-text-on-adaptive-contrast)] opacity-0 group-aria-current:max-w-64 group-aria-current:opacity-100 effects:transition-all effects:duration-300 effects:ease-in-out"
                >
                  {{ t(section.labelKey) }}
                </small>
              </span>
            </button>
          </TooltipTrigger>

          <TooltipPortal>
            <TooltipContent
              data-section-tooltip
              side="right"
              :side-offset="12"
              :collision-padding="16"
              class="z-2147483647 w-max max-w-70 origin-center max-lg:hidden effects:animate-[section-tooltip-pop_360ms_ease-out_both] effects:data-[state=closed]:animate-[section-tooltip-out_180ms_ease-in_both]"
            >
              <span
                class="block origin-center rounded-full bg-section-tooltip px-5 py-3 leading-snug text-on-section-tooltip effects:animate-[section-tooltip-idle_3s_ease-in-out_infinite]"
              >
                {{ t(section.labelKey) }}
              </span>
            </TooltipContent>
          </TooltipPortal>
        </TooltipRoot>
      </nav>
    </TooltipProvider>
  </div>

  <div
    id="progress-bar"
    class="progress-bar fixed top-0 right-[max(0px,calc((100%-var(--breakpoint-3xl))/2))] z-100 flex bg-progress-bar mix-blend-difference max-lg:w-[2px] max-lg:rounded-b-full"
  ></div>

  <div
    ref="menuRightRef"
    id="menu-right"
    class="fixed top-0 right-[max(0px,calc((100%-var(--breakpoint-3xl))/2))] z-200 flex min-h-svh w-10 items-center justify-center max-lg:invisible lg:w-15"
  >
    <div class="flex w-fit rotate-90 items-center justify-center gap-5 whitespace-nowrap">
      <Button
        variant="secondary"
        size="compact"
        tone="control"
        :aria-label="effectsToggleLabel"
        @click="toggleEffects"
      >
        {{ effectsToggleLabel }}
      </Button>

      <Button
        variant="secondary"
        size="compact"
        tone="control"
        :aria-label="themeToggleLabel"
        @click="toggleTheme"
      >
        {{ themeToggleLabel }}
      </Button>

      <Button
        variant="secondary"
        size="compact"
        tone="control"
        :aria-label="langToggleLabel"
        @click="toggleLocale"
      >
        {{ langToggleLabel }}
      </Button>

      <Button
        v-if="isDevelopment"
        variant="secondary"
        size="compact"
        tone="control"
        :aria-label="devModeToggleLabel"
        @click="toggleDevMode"
      >
        {{ devModeToggleLabel }}
      </Button>

      <Button
        id="scroll-to-top"
        variant="secondary"
        size="compact"
        tone="control"
        class="transition-opacity duration-300 ease-in-out disabled:pointer-events-none disabled:opacity-25"
        :disabled="isHeroVisible"
      >
        {{ t("buttons.toTop") }}
      </Button>
    </div>
  </div>
</template>

<script setup>
import { useIntersectionObserver } from "@vueuse/core";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import {
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from "reka-ui";
import Button from "./Button.vue";
import { devModeEnabled, toggleDevMode } from "../features/preferences/dev-mode";
import { effectsEnabled, toggleEffectsMode } from "../features/preferences/effects-toggle";
import { currentTheme, getTargetTheme, setTheme } from "../features/preferences/theme-toggle";

const isDevelopment = import.meta.env.DEV;
const { locale, t, tm } = useI18n();
const sectionNavItems = computed(() =>
  Object.keys(tm("navigation.sections"))
    .filter((id) => id !== "hero" && id !== "pricing")
    .map((id) => ({
      id,
      labelKey: `navigation.sections.${id}`,
    })),
);

const themeToggleLabel = computed(() =>
  t(`theme-toggle.${currentTheme.value === "dark" ? "light" : "dark"}`),
);
const langToggleLabel = computed(() => t("lang-toggle"));
const effectsToggleLabel = computed(() =>
  t(`effects-toggle.${effectsEnabled.value ? "disable" : "enable"}`),
);
const devModeToggleLabel = computed(() =>
  t(`dev-mode-toggle.${devModeEnabled.value ? "disable" : "enable"}`),
);
const heroElement = ref(null);
const isHeroVisible = ref(true);
const menuRightRef = ref(null);
const sectionNavRef = ref(null);

defineExpose({
  getIntroTargets: () => ({ menu: menuRightRef.value, dots: sectionNavRef.value }),
});

useIntersectionObserver(
  heroElement,
  ([entry]) => {
    isHeroVisible.value = (entry?.intersectionRatio ?? 0) >= 0.01;
  },
  { threshold: [0, 0.01] },
);

onMounted(() => {
  heroElement.value = document.getElementById("hero");
  if (!heroElement.value) isHeroVisible.value = false;
});

const toggleEffects = () => {
  toggleEffectsMode();
  window.location.reload();
};

const toggleTheme = () => {
  setTheme(getTargetTheme());
};

const toggleLocale = () => {
  const current = locale.value;

  locale.value = current === "ru" ? "en" : "ru";
};
</script>

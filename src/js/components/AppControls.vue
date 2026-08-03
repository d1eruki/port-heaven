<template>
  <div
    id="menu-dot"
    class="fixed top-0 left-0 z-2147483647 flex min-h-svh w-10 items-center justify-center text-app-controls mix-blend-difference transition-opacity duration-300 ease-in-out lg:pointer-events-none lg:z-50 lg:w-15 lg:opacity-0"
  >
    <TooltipProvider
      :delay-duration="0"
      :skip-delay-duration="0"
    >
      <nav
        data-section-nav
        class="flex w-fit flex-col gap-5"
        :aria-label="t('navigation.label')"
      >
        <TooltipRoot
          v-for="section in sectionNavItems"
          :key="section.id"
        >
          <TooltipTrigger as-child>
            <button
              type="button"
              class="dot group"
              :data-target="`#${section.id}`"
              :aria-label="t(section.labelKey)"
              aria-current="false"
            >
              <svg
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
            </button>
          </TooltipTrigger>

          <TooltipPortal>
            <TooltipContent
              data-section-tooltip
              side="right"
              :side-offset="12"
              :collision-padding="16"
              class="z-2147483647 w-max max-w-70 rounded-full bg-section-tooltip px-5 py-3 leading-snug text-on-section-tooltip"
            >
              {{ t(section.labelKey) }}
            </TooltipContent>
          </TooltipPortal>
        </TooltipRoot>
      </nav>
    </TooltipProvider>
  </div>

  <div
    id="progress-bar"
    class="progress-bar fixed top-0 right-0 z-100 hidden bg-progress-bar mix-blend-difference lg:flex"
  ></div>

  <div
    id="menu-right"
    class="fixed top-1/2 right-0 z-200 flex h-10 w-10 -translate-y-1/2 rotate-90 items-center justify-center gap-5 whitespace-nowrap lg:top-0 lg:h-15 lg:w-auto lg:translate-y-0 lg:rotate-0 lg:justify-end lg:px-5"
  >
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
  </div>

  <Button
    id="scroll-to-top"
    variant="secondary"
    size="compact"
    tone="control"
    class="fixed right-0 bottom-5 z-200 h-10 w-10 rotate-90 items-center justify-end whitespace-nowrap lg:bottom-0 lg:h-15 lg:w-auto lg:rotate-0 lg:px-5"
  >
    {{ t("buttons.toTop") }}
  </Button>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import {
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from "reka-ui";
import Button from "./Button.vue";
import { effectsEnabled, toggleEffectsMode } from "../features/preferences/effects-toggle";
import { currentTheme, getTargetTheme, setTheme } from "../features/preferences/theme-toggle";

const { locale, t, tm } = useI18n();
const sectionNavItems = computed(() =>
  Object.keys(tm("navigation.sections")).map((id) => ({
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

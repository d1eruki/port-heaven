<template>
  <div
    id="menu-dot"
    class="fixed top-0 left-0 z-[2147483647] flex min-h-svh w-10 items-center justify-center text-app-controls mix-blend-difference transition-opacity duration-300 ease-in-out lg:pointer-events-none lg:z-50 lg:w-15 lg:opacity-0"
  >
    <nav
      data-section-nav
      class="flex w-fit flex-col gap-5"
      :aria-label="t('navigation.label')"
    >
      <button
        v-for="section in SECTION_NAV_ITEMS"
        :key="section.id"
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
    </nav>
  </div>

  <div
    id="progress-bar"
    class="progress-bar fixed top-0 right-0 z-100 hidden bg-progress-bar mix-blend-difference lg:flex"
  ></div>

  <div
    id="menu-right"
    class="fixed top-1/2 right-0 z-200 flex h-10 w-10 -translate-y-1/2 rotate-90 items-center justify-center gap-5 whitespace-nowrap text-app-controls mix-blend-difference lg:top-0 lg:h-15 lg:w-auto lg:translate-y-0 lg:rotate-0 lg:justify-end lg:px-5"
  >
    <button
      type="button"
      :aria-label="effectsToggleLabel"
      class="group flex"
      @click="toggleEffects"
    >
      <small class="opacity-0 group-hover:opacity-100">/</small
      ><small>{{ effectsToggleLabel }}</small>
    </button>

    <button
      type="button"
      :aria-label="themeToggleLabel"
      class="group flex"
      @click="toggleTheme"
    >
      <small class="opacity-0 group-hover:opacity-100">/</small
      ><small>{{ themeToggleLabel }}</small>
    </button>

    <button
      type="button"
      :aria-label="langToggleLabel"
      class="group flex"
      @click="toggleLocale"
    >
      <small class="opacity-0 group-hover:opacity-100">/</small><small>{{ langToggleLabel }}</small>
    </button>
  </div>

  <button
    id="scroll-to-top"
    type="button"
    class="group fixed right-0 bottom-5 z-200 flex h-10 w-10 rotate-90 items-center justify-end whitespace-nowrap text-app-controls mix-blend-difference lg:bottom-0 lg:h-15 lg:w-auto lg:rotate-0 lg:px-5"
  >
    <small class="opacity-0 group-hover:opacity-100">/</small
    ><small>{{ t("buttons.toTop") }}</small>
  </button>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { SECTION_NAV_ITEMS } from "../dom/dom-selectors";
import i18n, { applyDocumentLocale, saveLocale } from "../libraries/i18n";
import { toggleEffectsMode } from "../features/preferences/effects-toggle";
import { getTargetTheme, setTheme } from "../features/preferences/theme-toggle";

const { t } = useI18n();
const props = defineProps({
  currentTheme: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(["theme-change"]);
const effectsOn = ref(false);

const themeToggleLabel = computed(() =>
  t(`theme-toggle.${props.currentTheme === "dark" ? "light" : "dark"}`),
);
const langToggleLabel = computed(() => t("lang-toggle"));
const effectsToggleLabel = computed(() =>
  t(`effects-toggle.${effectsOn.value ? "disable" : "enable"}`),
);

onMounted(() => {
  queueMicrotask(() => {
    effectsOn.value = document.documentElement.classList.contains("effects");
  });
});

const toggleEffects = () => {
  toggleEffectsMode();
  window.location.reload();
};

const toggleTheme = () => {
  emit("theme-change", setTheme(getTargetTheme()));
};

const toggleLocale = () => {
  const current = i18n.global.locale.value;
  const next = current === "ru" ? "en" : "ru";
  i18n.global.locale.value = next;
  applyDocumentLocale(next);
  saveLocale(next);
};
</script>

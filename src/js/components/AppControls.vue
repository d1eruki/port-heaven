<template>
  <div
    id="menu-dot"
    class="fixed top-0 left-0 z-50 flex min-h-svh w-15 items-center justify-center text-blend transition-opacity duration-300 ease-in-out lg:pointer-events-none lg:opacity-0 hw:mix-blend-difference"
  >
    <nav
      data-section-nav
      class="flex w-fit flex-col gap-5"
      aria-label="Section navigation"
    ></nav>
  </div>

  <div
    id="progress-bar"
    class="progress-bar fixed top-0 right-0 z-100 hidden bg-blend mix-blend-difference lg:flex"
  ></div>

  <div
    id="menu-right"
    class="fixed top-5 right-5 z-200 flex justify-end gap-5 text-blend mix-blend-difference lg:top-15 lg:right-15"
  >
    <button
      type="button"
      :aria-label="variantToggleLabel"
      class="group flex"
      @click="toggleVariant"
    >
      <small class="opacity-0 group-hover:opacity-100">/</small
      ><small>{{ variantToggleLabel }}</small>
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
    class="group fixed right-5 bottom-5 z-200 flex text-blend mix-blend-difference lg:right-15 lg:bottom-15"
  >
    <small class="opacity-0 group-hover:opacity-100">/</small
    ><small>{{ t("buttons.toTop") }}</small>
  </button>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import i18n, { saveLocale, setDocumentLanguage } from "../libraries/i18n";
import { getCurrentTheme, getTargetTheme, setTheme } from "../features/preferences/theme-toggle";
import { getTargetVariant, setVariant } from "../features/preferences/variant-toggle";
import { getVariantLabel } from "../variants/registry";

const { t } = useI18n();
const currentTheme = ref(getCurrentTheme());

const variantToggleLabel = computed(() => getVariantLabel(getTargetVariant()));
const themeToggleLabel = computed(() =>
  t(`theme-toggle.${currentTheme.value === "dark" ? "light" : "dark"}`),
);
const langToggleLabel = computed(() => t("lang-toggle"));

const toggleTheme = () => {
  currentTheme.value = setTheme(getTargetTheme());
};

const toggleVariant = () => {
  setVariant(getTargetVariant());
};

const toggleLocale = () => {
  const current = i18n.global.locale.value;
  const next = current === "ru" ? "en" : "ru";
  i18n.global.locale.value = next;
  setDocumentLanguage(next);
  saveLocale(next);
  window.dispatchEvent(new Event("localechange"));
};
</script>

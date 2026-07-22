<template>
  <div
    id="menu-dot"
    class="fixed top-0 left-0 z-50 flex min-h-svh w-15 items-center justify-center text-blend mix-blend-difference transition-opacity duration-300 ease-in-out lg:pointer-events-none lg:opacity-0"
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
    class="progress-bar fixed top-0 right-0 z-100 hidden bg-blend mix-blend-difference lg:flex"
  ></div>

  <div
    id="menu-right"
    class="fixed top-5 right-5 z-200 flex justify-end gap-5 text-blend mix-blend-difference lg:top-15 lg:right-15"
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
    class="group fixed right-5 bottom-5 z-200 flex text-blend mix-blend-difference lg:right-15 lg:bottom-15"
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

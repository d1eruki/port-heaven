<template>
  <header
    class="lancet-nav sticky top-0 left-0 z-100 flex w-50 flex-col justify-end p-10 mix-blend-difference lg:min-h-dvh lg:justify-between lg:mix-blend-normal"
  >
    <p class="hidden w-fit lg:block">{{ t("brand.logo") }}</p>
    <div
      class="hidden w-fit flex-col gap-5 lg:flex"
      aria-label="Lancet section navigation"
    >
      <button
        v-for="item in items"
        :key="item.id"
        type="button"
        :data-open-block="item.id"
        :data-scroll-target="`[data-section='${item.id}']`"
        class="light:text-(--color-grey) self-start transition-colors duration-300"
        :class="item.class"
      >
        {{ item.label }}
      </button>
    </div>
    <button
      id="lang-toggle"
      class="hidden w-fit"
    >
      en
    </button>
    <button
      id="scroll-to-top"
      class="hidden w-fit"
    >
      {{ t("buttons.toTop") }}
    </button>
    <div class="flex gap-5">
      <a
        class="w-fit"
        href="mailto:stapps90@gmail.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Mail"
      >
        <span class="icon-[ic--baseline-alternate-email] size-7.5"></span>
      </a>
      <a
        class="w-fit"
        href="https://t.me/d1eruki"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Telegram"
      >
        <span class="icon-[ic--baseline-telegram] size-7.5"></span>
      </a>
      <button
        id="variant-toggler"
        class="w-fit"
        type="button"
        @click="toggleVariant"
      >
        {{ variantToggleLabel }}
      </button>
      <button
        id="theme-toggler"
        class="hidden size-7.5"
      ></button>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import {
  currentVariant,
  getTargetVariant,
  setVariant,
} from "../../features/preferences/variant-toggle";

const { t } = useI18n();

const variantToggleLabel = computed(() =>
  currentVariant.value === "lancet" ? "stasis" : "lancet",
);

const items = computed(() => [
  { id: "about", label: t("menu.about.title") },
  { id: "projects", label: t("menu.projects.title") },
  { id: "design", label: t("menu.designs.title") },
  { id: "creatives", label: t("menu.creatives.title"), class: "light:text-(--color-red)" },
  { id: "footer", label: t("menu.footer.title") },
]);

const toggleVariant = () => {
  setVariant(getTargetVariant());
};
</script>

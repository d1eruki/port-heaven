<template>
  <section
    data-section="design"
    id="design"
    class="relative overflow-visible"
  >
    <div
      class="top-0 grid w-dvw overflow-visible will-change-transform lg:h-dvh lg:grid-flow-col lg:grid-rows-2"
      id="design-inner"
    >
      <div
        data-design-intro
        class="col-span-1 grid h-full w-dvw shrink-0 content-center gap-5 bg-inverse p-15 text-inverse-fg lg:w-[25dvw] lg:bg-canvas lg:text-fg"
      >
        <h2>{{ t("menu.designs.title") }}</h2>
        <MenuDesc
          class="lg:max-w-150"
          :menu-desc="t('menu.designs.description')"
        />
      </div>
      <Design
        v-for="design in translatedDesigns"
        :key="design.titleKey"
        :design-name="design.name"
        :design-desc="design.description"
        :design-url="design.url"
        :design-tags="design.tags"
      />
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { designs } from "../data/designs";
import Design from "../vue-components/designs.vue";
import MenuDesc from "../vue-components/menu-description.vue";

const { t } = useI18n();

const translatedDesigns = computed(() =>
  designs.map((design) => ({
    ...design,
    name: t(design.titleKey),
    description: t(design.textKey),
  })),
);
</script>

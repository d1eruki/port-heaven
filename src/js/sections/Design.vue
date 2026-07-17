<template>
  <section
    data-section="design"
    id="design"
    class="relative overflow-visible"
  >
    <div
      class="top-0 grid w-full overflow-x-hidden will-change-transform effects:lg:h-dvh effects:lg:w-dvw effects:lg:grid-flow-col effects:lg:grid-rows-2 no-effects:min-h-dvh no-effects:grid-cols-1 no-effects:md:grid-cols-2 no-effects:lg:auto-rows-fr no-effects:lg:grid-cols-3 no-effects:xl:grid-cols-4"
      id="design-inner"
    >
      <div
        data-design-intro
        class="col-span-1 grid h-full w-full shrink-0 content-center gap-5 bg-inverse p-15 text-inverse-fg lg:bg-canvas lg:text-fg effects:lg:w-[25dvw]"
      >
        <h2>{{ t("menu.designs.title") }}</h2>
        <MenuDescription
          class="lg:max-w-150"
          :menu-desc="t('menu.designs.description')"
        />
      </div>
      <DesignCard
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
import DesignCard from "../components/DesignCard.vue";
import MenuDescription from "../components/MenuDescription.vue";

const { t } = useI18n();

const translatedDesigns = computed(() =>
  designs.map((design) => ({
    ...design,
    name: t(design.titleKey),
    description: t(design.textKey),
  })),
);
</script>

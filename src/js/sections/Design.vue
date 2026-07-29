<template>
  <section
    data-section="design"
    id="design"
    class="relative overflow-visible"
  >
    <div
      id="design-viewport"
      class="p-10 lg:p-15 effects:lg:h-dvh"
    >
      <div class="effects:lg:h-full">
        <div
          class="grid w-full gap-5 overflow-x-hidden will-change-transform lg:gap-0 effects:lg:h-full effects:lg:grid-flow-col effects:lg:grid-rows-2 no-effects:min-h-dvh no-effects:grid-cols-1 no-effects:md:grid-cols-2 no-effects:lg:auto-rows-fr no-effects:lg:grid-cols-3 no-effects:xl:grid-cols-4"
          id="design-inner"
        >
          <div
            data-design-intro
            class="col-span-1 grid w-full shrink-0 content-center gap-5 rounded-4xl bg-inverse p-5 text-on-inverse lg:rounded-none lg:bg-canvas lg:p-15 lg:text-primary effects:lg:w-[25dvw]"
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
      </div>
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

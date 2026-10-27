<!-- Секция макетов с мобильным заголовком над свайп-лентой на высоту экрана и сеткой на компьютере. -->
<template>
  <section
    data-section="design"
    id="design"
    class="relative w-full min-w-0 overflow-visible"
  >
    <div
      id="design-viewport"
      class="min-w-0 p-section max-lg:pt-section-gap max-lg:pb-0 max-lg:flex max-lg:min-h-svh max-lg:flex-col max-lg:gap-content effects:lg:h-dvh"
    >
      <div class="grid min-w-0 shrink-0 gap-related rounded-4xl bg-inverse p-panel text-on-inverse lg:hidden">
        <h2 id="design-heading-mobile" class="text-left">{{ t("menu.designs.title") }}</h2>
        <MenuDescription :menu-desc="t('menu.designs.description')" />
      </div>
      <div class="min-w-0 max-lg:flex max-lg:flex-1 max-lg:flex-col max-lg:gap-2 effects:lg:h-full">
        <div class="min-w-0 max-lg:-mx-section max-lg:flex max-lg:flex-1 effects:lg:h-full">
          <div
            class="grid w-full min-w-0 gap-2 will-change-transform max-lg:relative max-lg:z-201 max-lg:flex-1 max-lg:snap-x max-lg:snap-mandatory max-lg:scroll-px-section max-lg:auto-cols-[85%] max-lg:grid-flow-col max-lg:grid-rows-[minmax(0,1fr)] max-lg:gap-content max-lg:overflow-x-auto max-lg:overscroll-x-contain max-lg:px-section max-lg:*:snap-start max-lg:*:snap-always lg:gap-0 lg:overflow-x-hidden effects:lg:h-full effects:lg:auto-cols-[25%] effects:lg:grid-flow-col effects:lg:grid-rows-2 no-effects:lg:min-h-dvh no-effects:lg:auto-rows-[calc((100dvh-2*var(--spacing-section))/2)] no-effects:lg:grid-cols-3 no-effects:xl:grid-cols-4"
            id="design-inner"
          >
            <div
              data-design-intro
              class="col-span-1 hidden w-full min-w-0 shrink-0 content-center gap-related rounded-4xl bg-inverse p-panel text-on-inverse lg:grid lg:rounded-none lg:bg-canvas lg:text-primary"
            >
              <h2 id="design-heading" class="text-left">{{ t("menu.designs.title") }}</h2>
              <MenuDescription
                :menu-desc="t('menu.designs.description')"
              />
            </div>
            <DesignCard
              v-for="design in translatedDesigns"
              :key="design.titleKey"
              class="max-lg:self-stretch"
              :design-name="design.name"
              :design-desc="design.description"
              :design-url="design.url"
              :design-tags="design.tags"
            />
          </div>
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

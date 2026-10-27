<!-- Секция макетов с мобильным заголовком над свайп-лентой на высоту экрана и сеткой на компьютере. -->
<template>
  <section
    data-section="design"
    id="design"
    class="relative w-full min-w-0 overflow-visible"
  >
    <div
      id="design-viewport"
      class="min-w-0 p-10 max-lg:flex max-lg:min-h-svh max-lg:flex-col max-lg:gap-10 lg:p-15 effects:lg:h-dvh"
    >
      <div class="grid min-w-0 shrink-0 gap-5 rounded-4xl bg-inverse p-5 text-on-inverse lg:hidden">
        <h2 id="design-heading-mobile">{{ t("menu.designs.title") }}</h2>
        <MenuDescription :menu-desc="t('menu.designs.description')" />
      </div>
      <div class="min-w-0 max-lg:flex max-lg:flex-1 max-lg:flex-col max-lg:gap-2 effects:lg:h-full">
        <div class="min-w-0 max-lg:-mx-10 max-lg:flex max-lg:flex-1 effects:lg:h-full">
          <div
            ref="designScroller"
            class="grid w-full min-w-0 gap-2 will-change-transform max-lg:relative max-lg:z-201 max-lg:flex-1 max-lg:snap-x max-lg:snap-mandatory max-lg:scroll-px-10 max-lg:auto-cols-[85%] max-lg:grid-flow-col max-lg:grid-rows-[minmax(0,1fr)] max-lg:gap-10 max-lg:overflow-x-auto max-lg:overscroll-x-contain max-lg:px-10 max-lg:*:snap-start max-lg:*:snap-always lg:gap-0 lg:overflow-x-hidden effects:lg:h-full effects:lg:auto-cols-[25%] effects:lg:grid-flow-col effects:lg:grid-rows-2 no-effects:lg:min-h-dvh no-effects:lg:auto-rows-[calc((100dvh---spacing(15))/2)] no-effects:lg:grid-cols-3 no-effects:xl:grid-cols-4"
            id="design-inner"
            @scroll.passive="updateScrollPosition"
          >
            <div
              data-design-intro
              class="col-span-1 hidden w-full min-w-0 shrink-0 content-center gap-5 rounded-4xl bg-inverse p-5 text-on-inverse lg:grid lg:rounded-none lg:bg-canvas lg:p-15 lg:text-primary"
            >
              <h2 id="design-heading">{{ t("menu.designs.title") }}</h2>
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
        <div
          role="group"
          aria-labelledby="design-heading-mobile"
          class="flex w-full shrink-0 items-center gap-2 lg:hidden"
        >
          <button
            v-for="(design, index) in translatedDesigns"
            :key="design.titleKey"
            type="button"
            :aria-label="design.name"
            :aria-current="activeDesignIndex === index ? 'true' : undefined"
            aria-controls="design-inner"
            class="flex h-8 w-2 min-w-0 shrink-0 basis-2 items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary effects:transition-all effects:duration-300 effects:ease-in-out"
            :class="activeDesignIndex === index ? 'grow' : 'grow-0'"
            @click="seekDesign(index)"
          >
            <span
              aria-hidden="true"
              class="h-2 w-full rounded-full bg-accent"
            ></span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import { useResizeObserver } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import { designs } from "../data/designs";
import DesignCard from "../components/DesignCard.vue";
import MenuDescription from "../components/MenuDescription.vue";

const { t } = useI18n();
const designScroller = ref(null);
const activeDesignIndex = ref(0);

const getDesignPositions = () => {
  const scroller = designScroller.value;
  if (!scroller) return [];

  const cards = Array.from(scroller.children).slice(1);
  const firstOffset = cards[0]?.offsetLeft ?? 0;
  const scrollExtent = Math.max(0, scroller.scrollWidth - scroller.clientWidth);

  return cards.map((card) => Math.min(scrollExtent, card.offsetLeft - firstOffset));
};

const updateScrollPosition = () => {
  const scroller = designScroller.value;
  if (!scroller) return;

  const positions = getDesignPositions();
  activeDesignIndex.value = positions.reduce(
    (nearest, position, index) =>
      Math.abs(position - scroller.scrollLeft) < Math.abs(positions[nearest] - scroller.scrollLeft)
        ? index
        : nearest,
    0,
  );
};

const seekDesign = (index) => {
  designScroller.value?.scrollTo({
    left: getDesignPositions()[index] ?? 0,
    behavior: "instant",
  });
};

useResizeObserver(designScroller, updateScrollPosition);

const translatedDesigns = computed(() =>
  designs.map((design) => ({
    ...design,
    name: t(design.titleKey),
    description: t(design.textKey),
  })),
);
</script>

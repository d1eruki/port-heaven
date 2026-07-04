<template>
  <section
    data-section="design"
    id="design"
    class="grid min-h-dvh grid-cols-1 pr-1.25 lg:ml-50 lg:auto-rows-fr lg:grid-cols-3"
  >
    <div class="col-span-1 grid h-fit content-center gap-5 p-10 lg:top-0 lg:h-full">
      <h2 class="glow-lg">{{ t("menu.designs.title") }}</h2>
      <p>{{ t("menu.designs.description") }}</p>
    </div>
    <a
      v-for="design in translatedDesigns"
      :key="design.titleKey"
      :href="design.url"
      target="_blank"
      rel="noopener noreferrer"
      class="group design relative z-10 grid gap-5 p-10 hover:z-100 lg:h-150 lg:items-center lg:rounded-4xl"
    >
      <h4 class="flex gap-3 group-hover:lg:text-black light:text-white">
        {{ design.name }}
      </h4>
      <div
        class="top-75 right-10 bottom-10 left-10 flex flex-wrap gap-5 self-end lg:absolute lg:flex lg:group-hover:hidden"
      >
        <div
          v-for="(tag, index) in design.tags"
          :key="index"
          class="flex gap-2.5 light:text-(--color-grey)"
        >
          <small class="flex gap-2.5">
            <span
              v-if="isAdaptiveTag(tag)"
              class="icon-[ic--baseline-phone-android]"
              aria-hidden="true"
              focusable="false"
            ></span>
            <span
              v-if="isDesktopTag(tag)"
              class="icon-[ic--baseline-monitor]"
              aria-hidden="true"
              focusable="false"
            ></span>
            {{ getTagName(tag) }}
          </small>
        </div>
      </div>
      <p
        class="right-10 bottom-10 left-10 block self-end lg:absolute lg:hidden lg:group-hover:block"
      >
        {{ design.description }}
      </p>
    </a>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { designs } from "../../data/designs";
import { adaptLancetDesigns } from "./adapters/designs";
import { getTagName, isAdaptiveTag, isDesktopTag } from "./adapters/tags";

const { t } = useI18n();

const translatedDesigns = computed(() => adaptLancetDesigns(t, designs));
</script>

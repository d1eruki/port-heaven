<!-- Карточка проекта с десктопной обложкой, переключателем и подробностями. -->
<template>
  <div
    ref="card"
    class="relative overflow-hidden rounded-4xl bg-surface-subtle max-lg:flex max-lg:w-full max-lg:flex-col lg:shrink-0 lg:grow-(--project-growth) lg:basis-(--strip-width) lg:overflow-clip lg:bg-[color:color-mix(in_srgb,var(--semantic-surface-contrast)_93%,var(--semantic-text-on-contrast))] lg:[--project-growth:0] lg:[--project-preview:0] effects:max-lg:sticky effects:max-lg:top-4"
  >
    <img
      v-if="desktop && projectCover"
      :src="projectCover"
      alt=""
      width="1334"
      height="1000"
      loading="lazy"
      decoding="async"
      class="pointer-events-none absolute inset-y-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2 opacity-(--project-preview) brightness-[calc(0.4-0.15*var(--project-growth))]"
    />
    <button
      v-if="desktop"
      type="button"
      class="absolute z-10 grid place-items-center focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-current"
      :class="
        expanded
          ? 'top-2 right-2 size-11 rounded-full text-(color:--semantic-text-on-contrast)'
          : 'inset-0 size-full rounded-4xl text-accent'
      "
      :aria-expanded="expanded"
      :aria-controls="panelId"
      :aria-label="projectName"
      @pointerenter="hovered = $event.pointerType !== 'touch'"
      @pointerleave="hovered = false"
      @click="$emit('toggle')"
      @keydown.esc.stop="expanded && $emit('toggle')"
    >
      <span
        v-if="expanded"
        aria-hidden="true"
        class="icon-[ic--baseline-close] size-8 opacity-(--project-growth)"
      ></span>
    </button>
    <span
      v-if="desktop"
      aria-hidden="true"
      class="pointer-events-none absolute top-1/2 left-[calc(var(--strip-width)/2)] z-20 translate-x-[calc(-50%-var(--project-growth)*(50%+var(--strip-width)/2))] -translate-y-1/2 rotate-180 font-heading text-[length:min(var(--text-heading-sm),3.5svh)] leading-none font-black whitespace-nowrap text-accent lowercase [writing-mode:vertical-rl]"
      >{{ projectName }}</span
    >
    <div
      :id="panelId"
      :inert="desktop && !expanded"
      class="flex min-h-[calc(100svh-2rem)] flex-col justify-start gap-content p-panel text-primary max-lg:flex-1 lg:absolute lg:inset-y-0 lg:left-0 lg:min-h-0 lg:w-(--open-width) lg:translate-x-[calc((1-var(--project-growth))*100%)] lg:items-start lg:justify-center-safe lg:overflow-y-auto lg:pt-16 lg:text-(color:--semantic-text-on-contrast)"
    >
      <div
        class="max-lg:contents lg:flex lg:w-fit lg:max-w-[min(65ch,100%)] lg:flex-col lg:gap-content"
      >
        <div class="flex flex-col gap-related">
          <h3 class="text-left">{{ projectName }}</h3>
          <TagsList
            class="max-lg:[&_small]:bg-primary/5 lg:[&_small]:bg-(--semantic-text-on-contrast)/10 lg:[&_small]:text-(color:--semantic-text-on-contrast)"
            :tags="projectTags"
            :show-icons="true"
          />
        </div>
        <div class="flex flex-col gap-related">
          <div
            v-for="section in projectDescription"
            :key="section.text"
            class="flex flex-col gap-2 text-left"
          >
            <h4
              v-if="section.heading"
              class="text-[length:var(--paragraph)]"
            >
              {{ section.heading }}
            </h4>
            <p class="text-left">{{ section.text }}</p>
          </div>
        </div>
      </div>
      <div class="flex flex-wrap gap-0 max-lg:mt-auto max-lg:gap-related max-lg:*:w-full">
        <Button
          v-for="(link, index) in projectLinks"
          :key="index"
          :href="link.url"
        >
          {{ link.name }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, ref, useTemplateRef, watch } from "vue";
import { effectsEnabled } from "../features/preferences/effects-toggle";
import { gsap } from "../libraries/gsap-scroll";
import Button from "./Button.vue";
import TagsList from "./TagsList.vue";

defineEmits(["toggle"]);

const props = defineProps({
  panelId: {
    type: String,
    required: true,
  },
  desktop: Boolean,
  expanded: Boolean,
  projectCover: String,
  projectName: {
    type: String,
    required: true,
    default: "Default title",
  },
  projectTags: {
    type: Array,
    default: () => [],
  },
  projectDescription: {
    type: Array,
    default: () => [],
  },
  projectLinks: {
    type: Array,
    default: () => [],
  },
});

const card = useTemplateRef("card");
const hovered = ref(false);
let previewAnimation;

watch(
  [hovered, () => props.expanded, () => props.desktop, effectsEnabled],
  ([isHovered, expanded, desktop, effects]) => {
    if (!props.projectCover) return;
    previewAnimation?.kill();
    if (!desktop) hovered.value = false;

    const preview = { "--project-preview": Number(desktop && (isHovered || expanded)) };
    if (desktop && effects) {
      previewAnimation = gsap.to(card.value, { ...preview, duration: 0.42, ease: "power2.out" });
    } else {
      gsap.set(card.value, preview);
    }
  },
  { flush: "post" },
);

onBeforeUnmount(() => previewAnimation?.kill());
</script>

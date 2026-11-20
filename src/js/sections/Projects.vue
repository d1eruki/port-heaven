<!-- Коммерческие проекты в десктопном аккордеоне и мобильном списке. -->
<template>
  <section
    data-section="projects"
    id="projects"
    class="min-h-svh p-section max-lg:pt-section-gap max-lg:pb-0"
  >
    <div
      class="grid gap-content lg:@container lg:flex lg:h-[max(18rem,100svh-2*var(--spacing-section))] lg:gap-(--project-gap) lg:overflow-clip lg:[--intro-width:calc((100cqw-var(--project-gap))/2)] lg:[--open-width:calc(var(--intro-width)+var(--strip-width))] lg:[--project-gap:calc(2*var(--spacing))] lg:[--strip-width:calc((100cqw-var(--intro-width))/var(--project-count)-var(--project-gap))]"
      :style="{ '--project-count': translatedProjects.length }"
    >
      <div
        ref="intro"
        data-project-panel
        class="lg:relative lg:min-w-0 lg:grow-(--project-growth) lg:basis-0 lg:[--project-growth:1]"
      >
        <div
          class="grid content-center gap-related overflow-hidden rounded-4xl bg-inverse p-panel text-on-inverse lg:absolute lg:inset-y-0 lg:right-0 lg:w-(--intro-width) lg:place-items-end lg:text-end"
        >
          <h2 class="text-left lg:text-end">{{ t("menu.projects.title") }}</h2>
          <MenuDescription :menu-desc="t('menu.projects.description')" />
        </div>
      </div>
      <div
        ref="projectList"
        class="lg:contents no-effects:max-lg:flex no-effects:max-lg:flex-col no-effects:max-lg:gap-content"
      >
        <ProjectCard
          v-for="(project, index) in translatedProjects"
          :key="project.titleKey"
          :panel-id="`commercial-project-${index}`"
          :project-name="project.name"
          :project-tags="project.tags"
          :project-description="project.description"
          :project-links="project.links"
          :project-cover="project.cover"
          :desktop="isDesktop"
          :expanded="activeProject === index"
          @toggle="activeProject = activeProject === index ? null : index"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { useMediaQuery } from "@vueuse/core";
import { computed, onBeforeUnmount, ref, useTemplateRef, watch } from "vue";
import { useI18n } from "vue-i18n";
import { projects } from "../data/projects";
import MenuDescription from "../components/MenuDescription.vue";
import ProjectCard from "../components/ProjectCard.vue";
import { effectsEnabled } from "../features/preferences/effects-toggle";
import { gsap } from "../libraries/gsap-scroll";
import { getBreakpointPx } from "../utils/breakpoints";

const { t } = useI18n();
const isDesktop = useMediaQuery(`(min-width: ${getBreakpointPx("lg")}px)`);
const activeProject = ref(null);
const intro = useTemplateRef("intro");
const projectList = useTemplateRef("projectList");
let animation;

watch(
  [activeProject, isDesktop, effectsEnabled],
  ([selected, desktop, effects], [previous]) => {
    animation?.kill();
    const panels = [intro.value, ...projectList.value.children];

    if (!desktop) {
      gsap.set(panels, { clearProps: "--project-growth" });
      activeProject.value = null;
      return;
    }

    const layout = { "--project-growth": (index) => Number(index === (selected ?? -1) + 1) };
    if (!effects || previous === selected) {
      gsap.set(panels, layout);
      return;
    }

    animation = gsap.to(panels, { ...layout, duration: 0.75, ease: "power2.inOut" });
  },
  { flush: "post" },
);

onBeforeUnmount(() => animation?.kill());

const translatedProjects = computed(() =>
  projects.map((project) => ({
    ...project,
    name: t(project.titleKey),
    description: project.description.map(({ headingKey, textKey }) => ({
      heading: headingKey ? t(headingKey) : "",
      text: t(textKey),
    })),
    links: project.links.map((link) => ({
      url: link.url,
      name: t(link.labelKey),
    })),
  })),
);
</script>

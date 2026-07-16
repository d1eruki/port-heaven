<template>
  <section
    data-section="projects"
    id="projects"
    class="grid min-h-svh grid-cols-1 lg:auto-rows-fr lg:grid-cols-2 lg:gap-0"
  >
    <div
      class="grid content-center gap-5 bg-inverse p-15 text-inverse-fg lg:sticky lg:inset-y-[50dvh] lg:top-0 lg:h-dvh lg:place-items-end lg:text-end"
    >
      <h2>{{ t("menu.projects.title") }}</h2>
      <MenuDescription
        class="lg:max-w-150"
        :menu-desc="t('menu.projects.description')"
      />
    </div>
    <div>
      <ProjectCard
        v-for="project in translatedProjects"
        :key="project.titleKey"
        :project-name="project.name"
        :project-description="project.description"
        :project-tags="project.tags"
        :project-text="project.text"
        :project-statistic="project.statistics"
        :project-links="project.links"
      />
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { projects } from "../data/projects";
import MenuDescription from "../components/MenuDescription.vue";
import ProjectCard from "../components/ProjectCard.vue";

const { t } = useI18n();

const translatedProjects = computed(() =>
  projects.map((project) => ({
    ...project,
    name: t(project.titleKey),
    description: t(project.descriptionKey),
    text: project.textKeys.map((key) => t(key)),
    statistics: (project.statisticKeys || []).map((key) => t(key)),
    links: project.links.map((link) => ({
      url: link.url,
      name: t(link.labelKey),
    })),
  })),
);
</script>

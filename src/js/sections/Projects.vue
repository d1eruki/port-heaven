<!-- Секция проектов с общей мобильной рамкой для шапки и списка работ. -->
<template>
  <section
    data-section="projects"
    id="projects"
    class="grid min-h-svh grid-cols-1 gap-content p-section max-lg:pt-section-gap max-lg:pb-0 lg:auto-rows-fr lg:py-0 lg:grid-cols-2"
  >
    <div
      data-project-panel
      class="lg:h-dvh lg:py-section"
    >
      <div
        class="grid content-center gap-related overflow-hidden rounded-4xl bg-inverse p-panel text-on-inverse lg:h-full lg:place-items-end lg:text-end"
      >
        <h2 class="text-left lg:text-end">{{ t("menu.projects.title") }}</h2>
        <MenuDescription
          :menu-desc="t('menu.projects.description')"
        />
      </div>
    </div>
    <div class="no-effects:max-lg:flex no-effects:max-lg:flex-col no-effects:max-lg:gap-content">
      <ProjectCard
        v-for="project in translatedProjects"
        :key="project.titleKey"
        class="effects:max-lg:sticky effects:max-lg:top-4"
        :project-name="project.name"
        :project-tags="project.tags"
        :project-text="project.text"
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
    text: project.textKeys.map((key) => t(key)),
    links: project.links.map((link) => ({
      url: link.url,
      name: t(link.labelKey),
    })),
  })),
);
</script>

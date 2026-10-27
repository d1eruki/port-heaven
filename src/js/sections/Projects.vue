<!-- Секция проектов с общей мобильной рамкой для шапки и списка работ. -->
<template>
  <section
    data-section="projects"
    id="projects"
    class="grid min-h-svh grid-cols-1 gap-10 px-10 pt-10 lg:auto-rows-fr lg:grid-cols-2 lg:gap-0 lg:p-0"
  >
    <div
      data-project-panel
      class="lg:h-dvh lg:p-15 lg:pr-0"
    >
      <div
        class="grid content-center gap-5 overflow-hidden rounded-4xl bg-inverse p-5 text-on-inverse lg:h-full lg:place-items-end lg:p-15 lg:text-end"
      >
        <h2>{{ t("menu.projects.title") }}</h2>
        <MenuDescription
          :menu-desc="t('menu.projects.description')"
        />
      </div>
    </div>
    <div>
      <template
        v-for="project in translatedProjects"
        :key="project.titleKey"
      >
        <ProjectCard
          class="effects:max-lg:sticky effects:max-lg:top-4"
          :project-name="project.name"
          :project-tags="project.tags"
          :project-text="project.text"
          :project-links="project.links"
        />
      </template>
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

<template>
  <section
    data-section="projects"
    id="projects"
    class="grid min-h-dvh grid-cols-1 lg:ml-50 lg:auto-rows-fr lg:grid-cols-2 lg:gap-0"
  >
    <div
      class="col-span-1 grid h-fit content-center gap-5 p-10 lg:sticky lg:top-0 lg:col-span-1 lg:h-dvh lg:text-center"
    >
      <h2 class="glow-lg">{{ t("menu.projects.title") }}</h2>
      <p>{{ t("menu.projects.description") }}</p>
    </div>
    <div class="scroll-section min-h-dvh p-10">
      <div class="wrapper relative flex h-full">
        <article
          v-for="project in translatedProjects"
          :key="project.titleKey"
          class="project light:bg-(--color-white) project absolute top-0 left-0 col-span-1 flex h-full w-full flex-col gap-5 border border-solid border-black will-change-transform lg:rounded-4xl"
        >
          <div class="flex h-full flex-col gap-5 p-5 lg:justify-between lg:p-15">
            <div class="flex flex-col gap-5">
              <h3 class="light:text-(--color-black)">{{ project.name }}</h3>
              <p class="light:text-(--color-grey)">{{ project.description }}</p>
              <div class="hidden flex-wrap gap-2 lg:flex">
                <div
                  v-for="(tag, index) in project.tags"
                  :key="index"
                  class="flex"
                >
                  <small
                    class="light:text-(--color-black) rounded-4xl border border-solid border-black px-5 py-2.5"
                  >
                    {{ getTagName(tag) }}
                  </small>
                </div>
              </div>
            </div>
            <p class="light:text-(--color-black)">{{ project.text }}</p>
            <div class="flex flex-wrap gap-2">
              <a
                v-for="(link, index) in project.links"
                :key="index"
                class="light:bg-(--color-black) active flex w-fit rounded-full px-5 py-2.5 lg:px-10 lg:py-5"
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
              >
                <p class="light:text-(--color-white)">{{ link.name }}</p>
              </a>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { projects } from "../../data/projects";

const { t } = useI18n();

const getTagName = (tag) => {
  if (tag == null) return "";
  if (typeof tag === "string" || typeof tag === "number") return String(tag);
  return tag.name || tag.label || tag.title || "";
};

const translatedProjects = computed(() =>
  projects.map((project) => ({
    ...project,
    name: t(project.titleKey),
    description: t(project.descriptionKey),
    text: project.textKeys.map((key) => t(key)).join(" "),
    links: project.links.map((link) => ({
      url: link.url,
      name: t(link.labelKey),
    })),
  })),
);
</script>

export const adaptLancetProjects = (t, sourceProjects) =>
  sourceProjects.map((project) => ({
    ...project,
    name: t(project.titleKey),
    description: t(project.descriptionKey),
    text: project.textKeys.map((key) => t(key)).join(" "),
    links: project.links.map((link) => ({
      url: link.url,
      name: t(link.labelKey),
    })),
  }));

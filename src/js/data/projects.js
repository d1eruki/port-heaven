import bloxelsCover from "../../assets/projects/bloxels.webp";
import medvedCover from "../../assets/projects/medved.webp";

export const projects = [
  {
    titleKey: "projects.varwin.title",
    tags: [
      "Figma",
      "Bootstrap",
      "UX/UI",
      "Design",
      { label: "Adaptive", icon: "phone" },
      { label: "Desktop", icon: "monitor" },
      "Prototype",
      "Frontend",
      "Testing",
    ],
    description: [
      { headingKey: "projects.varwin.download.title", textKey: "projects.varwin.download.text" },
      { headingKey: "projects.varwin.registry.title", textKey: "projects.varwin.registry.text" },
      { headingKey: "projects.varwin.xrms.title", textKey: "projects.varwin.xrms.text" },
    ],
    links: [
      {
        url: "https://www.figma.com/design/1ZqyEqlbGfuB5hPpoLRQHq/Edu-Website?node-id=6248-4815&t=IRW4BQuAYAiFV8KU-1",
        labelKey: "projects.buttons.websiteDesign",
      },
      {
        url: "https://varwin.com/ru/education/download-xrms",
        labelKey: "projects.buttons.downloadPage",
      },
      {
        url: "https://varwin.com/ru/education/projects",
        labelKey: "projects.buttons.projectRegistry",
      },
      {
        url: "https://www.figma.com/design/A1gPX0YvtGRoFDUwv6KJt1/Varwin-XRMS?node-id=3714-8686&t=FpdbmpnOhp966LPP-1",
        labelKey: "projects.buttons.xrmsDesign",
      },
    ],
  },
  {
    titleKey: "projects.bloxels.title",
    cover: bloxelsCover,
    tags: ["Figma", "Redesign", "Prototype", "Frontend", "Tailwind CSS"],
    description: [
      { headingKey: "projects.bloxels.landing.title", textKey: "projects.bloxels.landing.text" },
      { headingKey: "projects.bloxels.promo.title", textKey: "projects.bloxels.promo.text" },
    ],
    links: [
      {
        url: "https://www.figma.com/design/5DkY0DJqEQl1Lot6sXqbee/",
        labelKey: "projects.buttons.landingDesign",
      },
      {
        url: "https://www.figma.com/design/wuRM0H0RuBDNn9z16w0OcB/",
        labelKey: "projects.buttons.promoDesign",
      },
      {
        url: "https://app.bloxels.ru/cat-plush/",
        labelKey: "projects.buttons.promoSite",
      },
    ],
  },
  {
    titleKey: "projects.medved.title",
    cover: medvedCover,
    tags: [
      "Redesign",
      "Frontend",
      { label: "Adaptive", icon: "phone" },
      "Vue",
      "Tailwind CSS",
      "Testing",
    ],
    description: [{ textKey: "projects.medved.text" }],
    links: [
      {
        url: "https://medved.beer/",
        labelKey: "projects.buttons.site",
      },
    ],
  },
];

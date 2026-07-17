const tagCategories = {
  format: {
    dashboard: { label: "Dashboard" },
    adaptive: { label: "Adaptive", icon: "phone" },
    desktop: { label: "Desktop", icon: "monitor" },
    mobileApp: { label: "Mobile app", icon: "phone" },
  },
  workType: {
    prototype: { label: "Prototype" },
    concept: { label: "Concept" },
    design: { label: "Design" },
    redesign: { label: "Redesign" },
  },
};

function getCategoryTag(category, value) {
  if (typeof value !== "string" || !tagCategories[category][value]) {
    throw new TypeError(`Unknown ${category} tag: ${String(value)}`);
  }

  return tagCategories[category][value];
}

export function createCategorizedTags({ format, workType }) {
  return [getCategoryTag("format", format), getCategoryTag("workType", workType)];
}

export const getTagName = (tag) => {
  if (tag == null) return "";
  if (typeof tag === "string" || typeof tag === "number") return String(tag);
  return tag.name || tag.label || tag.title || "";
};

export const isAdaptiveTag = (tag) => getTagName(tag).toLowerCase().includes("adaptive");

export const isDesktopTag = (tag) => getTagName(tag).toLowerCase().includes("desktop");

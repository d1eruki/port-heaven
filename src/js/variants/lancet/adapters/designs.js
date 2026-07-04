export const adaptLancetDesigns = (t, sourceDesigns) =>
  sourceDesigns.map((design) => ({
    ...design,
    name: t(design.titleKey),
    description: t(design.textKey),
  }));

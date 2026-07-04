export const adaptLancetCreatives = (sourceCreatives) =>
  sourceCreatives.map((creative) => ({
    ...creative,
    isVideo: creative.type === "video",
  }));

const creativeModules = import.meta.glob(
  "../../assets/creatives/priority-{1,2,3}/*.{avif,jpeg,jpg,mp4,ogg,png,webm,webp}",
  {
    eager: true,
    import: "default",
    query: "?url",
  },
);

export const creativeAssets = Object.entries(creativeModules)
  .sort(([firstPath], [secondPath]) => firstPath.localeCompare(secondPath))
  .map(([assetPath, src]) => {
    const [, priority, id] = assetPath.match(/\/priority-([123])\/([^/]+)\.[^.]+$/) ?? [];

    return {
      id,
      priority: Number(priority),
      src,
    };
  });

const creativeModules = import.meta.glob(
  "../../assets/creatives/priority-{1,2,3}/*.{avif,jpeg,jpg,mp4,ogg,png,webm,webp}",
  {
    eager: true,
    import: "default",
    query: "?url",
  },
);

const imageSources = import.meta.glob(
  "../../assets/creatives/priority-{1,2,3}/*.{avif,jpeg,jpg,png,webp}",
  {
    eager: true,
    import: "default",
    query: "?responsive",
  },
);

// Keep layout identities stable when descriptive source filenames change.
const creativeIdByFilename = {
  "gogo-card-autumn-promotion": "Frame 6",
  "vlad-birthday-lighthouse": "DRVLAD",
};

export const creativeAssets = Object.entries(creativeModules)
  .sort(([firstPath], [secondPath]) => firstPath.localeCompare(secondPath))
  .map(([assetPath, src]) => {
    const [, priority, filename] = assetPath.match(/\/priority-([123])\/([^/]+)\.[^.]+$/) ?? [];
    const id = creativeIdByFilename[filename] ?? filename;

    if (!id || ![1, 2, 3].includes(Number(priority))) {
      throw new Error(`Invalid creative asset path: ${assetPath}`);
    }
    return {
      id,
      priority: Number(priority),
      src,
      ...imageSources[assetPath],
    };
  });

const creativeIds = new Set();
for (const creative of creativeAssets) {
  if (creativeIds.has(creative.id)) throw new Error(`Duplicate creative ID: ${creative.id}`);
  creativeIds.add(creative.id);
}

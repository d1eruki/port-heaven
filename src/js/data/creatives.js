import { creativeAssets } from "./creative-assets";

const DEFAULT_PRIORITY = 2;
const VIDEO_SOURCE_PATTERN = /\.(?:mp4|webm|ogg)(?:[?#]|$)/i;
const normalizeCreative = (creative) => ({
  ...creative,
  alt: creative.alt ?? `Creative ${creative.id.replaceAll("-", " ")}`,
  priority: creative.priority ?? DEFAULT_PRIORITY,
  type: creative.type ?? (VIDEO_SOURCE_PATTERN.test(creative.src) ? "video" : "image"),
});

const hashString = (value) => {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
};

const getSeededSalt = (salt, seed) => (seed === 0 ? salt : `${salt}:${seed}`);

const shuffleStable = (items, salt, seed) =>
  [...items].sort(
    (first, second) =>
      hashString(`${getSeededSalt(salt, seed)}:${first.id}`) -
      hashString(`${getSeededSalt(salt, seed)}:${second.id}`),
  );

const distributePriorityCreatives = (seed) => {
  const normalizedCreatives = creativeAssets.map(normalizeCreative);
  const important = shuffleStable(
    normalizedCreatives.filter(({ priority }) => priority === 1),
    "priority-1",
    seed,
  );
  const supporting = shuffleStable(
    normalizedCreatives.filter(({ priority }) => priority !== 1),
    "supporting",
    seed,
  );
  const bucketCount = important.length + 1;

  return Array.from({ length: bucketCount }, (_, bucketIndex) => {
    const start = Math.floor((bucketIndex * supporting.length) / bucketCount);
    const end = Math.floor(((bucketIndex + 1) * supporting.length) / bucketCount);
    const bucket = supporting.slice(start, end);

    return bucketIndex < important.length ? [...bucket, important[bucketIndex]] : bucket;
  }).flat();
};

export const createCreatives = (seed = 0) => distributePriorityCreatives(seed);

export const creatives = createCreatives();

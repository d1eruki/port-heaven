import { creativeAssets } from "./creative-assets";

const DEFAULT_PRIORITY = 2;
const VIDEO_SOURCE_PATTERN = /\.(?:mp4|webm|ogg)(?:[?#]|$)/i;
const CREATIVE_OVERRIDES = {
  "2025-artem-y": {
    alt: "Artem birthday creative",
    width: 1500,
    height: 2121,
  },
  saasoft: {
    alt: "Saasoft creative layout",
    width: 1080,
    height: 900,
  },
  siyay: {
    alt: "Siyay creative layout",
    width: 2560,
    height: 1440,
  },
  "varwin-opening": {
    alt: "Varwin opening creative",
    type: "video",
  },
};

const normalizeCreative = (creative) => {
  const normalized = {
    ...creative,
    ...CREATIVE_OVERRIDES[creative.id],
  };

  return {
    ...normalized,
    alt: normalized.alt ?? `Creative ${normalized.id.replaceAll("-", " ")}`,
    priority: normalized.priority ?? DEFAULT_PRIORITY,
    type: normalized.type ?? (VIDEO_SOURCE_PATTERN.test(normalized.src) ? "video" : "image"),
  };
};

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

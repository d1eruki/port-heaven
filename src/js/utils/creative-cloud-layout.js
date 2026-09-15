const HORIZONTAL_ANCHORS = [-3, 7, 18, 31, 44, 57, 70, 82];
const STREAM_INTRO_HEIGHT = 112;
const STREAM_ITEM_STEP = 14;
const STREAM_ITEM_JITTER = 8;
const STREAM_OUTRO_HEIGHT = 100;
const MIN_ITEM_WIDTH = 18;
const MAX_ITEM_WIDTH = 24;
const DEFAULT_PRIORITY = 2;

const DEPTHS = [
  { scale: 0.8, speed: 0.25, zIndex: 10 },
  { scale: 0.95, speed: 0.45, zIndex: 20 },
  { scale: 1.1, speed: 0.7, zIndex: 30 },
  { scale: 1.25, speed: 1, zIndex: 40 },
];

const PRIORITY_ANCHORS = {
  1: [18, 31, 44, 57, 70],
  2: HORIZONTAL_ANCHORS,
  3: [-3, 7, 70, 82],
};

const hashString = (value) => {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
};

const createRandom = (seed) => () => {
  seed += 0x6d2b79f5;
  let value = seed;
  value = Math.imul(value ^ (value >>> 15), value | 1);
  value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
  return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
};

const round = (value) => Math.round(value * 10) / 10;

const normalizePriority = (priority) =>
  Math.min(3, Math.max(1, Math.round(Number(priority) || DEFAULT_PRIORITY)));

const biasRandomByPriority = (value, priority) => {
  if (priority === 1) return 1 - (1 - value) ** 2;
  if (priority === 3) return value ** 2;

  return value;
};

const getCreativeAspectRatio = (creative) => {
  if (creative.width && creative.height) return creative.width / creative.height;
  if (creative.type === "video") return 16 / 9;

  const dimensions = creative.src.match(/\/(\d+)\/(\d+)(?:[?#]|$)/);
  if (dimensions) return Number(dimensions[1]) / Number(dimensions[2]);

  return 4 / 3;
};

export const createCreativeCloudItem = (creative, index) => {
  const random = createRandom(hashString(creative.id ?? creative.src));
  const priority = normalizePriority(creative.priority);
  const horizontalAnchors = PRIORITY_ANCHORS[priority];
  const horizontalAnchor =
    horizontalAnchors[(index * 3 + Math.floor(random() * 2)) % horizontalAnchors.length];
  const depthRandom = biasRandomByPriority(random(), priority);
  const depth = DEPTHS[Math.min(Math.floor(depthRandom * DEPTHS.length), DEPTHS.length - 1)];
  const widthRandom = biasRandomByPriority(random(), priority);
  const width = round(MIN_ITEM_WIDTH + widthRandom * (MAX_ITEM_WIDTH - MIN_ITEM_WIDTH));
  const left = round(
    Math.min(98 - width, Math.max(-3, horizontalAnchor + (random() - 0.5) * 10)),
  );
  const top = round(STREAM_INTRO_HEIGHT + index * STREAM_ITEM_STEP + random() * STREAM_ITEM_JITTER);
  const driftX = round((random() - 0.5) * 8);
  const driftY = round(12 + random() * 18);
  const rotation = random() < 0.55 ? round((random() - 0.5) * 6) : 0;
  const aspectRatio = getCreativeAspectRatio(creative);

  return {
    ...creative,
    aspectRatio,
    depth: depth.speed,
    driftX,
    driftY,
    layoutTop: top,
    layoutWidth: width,
    priority,
    style: {
      "--creative-left": `${left}%`,
      "--creative-rotation": `${rotation}deg`,
      "--creative-top": `${top}dvh`,
      "--creative-width": `${width}vw`,
      "--creative-z-index": depth.zIndex,
    },
  };
};

export const getCreativeCloudHeight = (items, viewportRatio) => {
  const contentBottom = items.reduce((furthestBottom, item) => {
    const itemHeight = (item.layoutWidth * viewportRatio) / item.aspectRatio;
    return Math.max(furthestBottom, item.layoutTop + itemHeight);
  }, STREAM_INTRO_HEIGHT);

  return Math.ceil(contentBottom + STREAM_OUTRO_HEIGHT);
};

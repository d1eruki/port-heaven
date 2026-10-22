export const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

export const calculateProgress = (current, start, end) => {
  if (start === end) return 0;
  return clamp((current - start) / (end - start), 0, 1);
};

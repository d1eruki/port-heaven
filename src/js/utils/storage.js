export const readStorageValue = ({ key, fallback, isValid }) => {
  try {
    const value = localStorage.getItem(key);
    return isValid(value) ? value : fallback;
  } catch {
    return fallback;
  }
};

export const saveStorageValue = ({ key, value, isValid }) => {
  if (!isValid(value)) return;

  try {
    localStorage.setItem(key, value);
  } catch {}
};

import { useStorage } from "@vueuse/core";

const ignoreStorageError = () => {};

export const useValidatedStorage = ({ key, fallback, isValid }) =>
  useStorage(key, fallback, localStorage, {
    writeDefaults: false,
    onError: ignoreStorageError,
    serializer: {
      read: (value) => (isValid(value) ? value : fallback),
      write: (value) => String(value),
    },
  });

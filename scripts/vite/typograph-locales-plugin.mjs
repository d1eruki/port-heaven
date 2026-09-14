import path from "node:path";
import Typograf from "typograf";

const typograf = new Typograf({ locale: ["ru", "en-US"] });

const typographMessages = (value) => {
  if (typeof value === "string") return typograf.execute(value);
  if (Array.isArray(value)) return value.map((item) => typographMessages(item));

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, typographMessages(nestedValue)]),
    );
  }

  return value;
};

export const typographLocalesPlugin = ({ localesRoot }) => {
  const normalizedLocalesRoot = `${path.resolve(localesRoot)}${path.sep}`;

  return {
    name: "port-heaven-typograph-locales",
    enforce: "pre",
    transform(source, id) {
      const filePath = id.split("?", 1)[0];
      if (!filePath.startsWith(normalizedLocalesRoot) || path.extname(filePath) !== ".json") {
        return null;
      }

      return {
        code: JSON.stringify(typographMessages(JSON.parse(source))),
        map: null,
      };
    },
  };
};

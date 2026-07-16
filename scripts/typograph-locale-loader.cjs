/* global require, module */
const Typograf = require("typograf");

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

module.exports = function typographLocaleLoader(source) {
  this.cacheable?.();

  return JSON.stringify(typographMessages(JSON.parse(source)));
};

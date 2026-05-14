import Typograf from "typograf";

const tp = new Typograf({ locale: ["ru", "en-US"] });

export const typographText = (value) => (typeof value === "string" ? tp.execute(value) : value);

export const typographMessages = (messages) => {
  if (typeof messages === "string") return typographText(messages);

  if (Array.isArray(messages)) {
    return messages.map((item) => typographMessages(item));
  }

  if (messages && typeof messages === "object") {
    return Object.fromEntries(Object.entries(messages).map(([key, value]) => [key, typographMessages(value)]));
  }

  return messages;
};

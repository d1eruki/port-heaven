import Typograf from "typograf";

const tp = new Typograf({ locale: ["ru", "en-US"] });

document.addEventListener("DOMContentLoaded", () => {
  document.body.innerHTML = tp.execute(document.body.innerHTML);
});

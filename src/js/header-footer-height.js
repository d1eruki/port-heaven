export const setHeight = () => {
  const footer = document.querySelector("footer");
  const header = document.querySelector("header");

  if (!footer || !header) return;

  footer.style.height = `${header.offsetHeight}px`;
};

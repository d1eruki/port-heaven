export function getHeaderHeight() {
  const header = document.querySelector("header");
  return header ? header.offsetHeight : 0;
}

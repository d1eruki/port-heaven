// Резервный WebP для обычных изображений и SVG-слоёв при ошибке AVIF.
const fallbacks = new Map();
const absoluteUrl = (source) => new URL(source, document.baseURI).href;

export const registerImageFormats = (avif, webp) => {
  fallbacks.set(absoluteUrl(avif), webp);
  return avif;
};

const useWebpFallback = (image) => {
  const svgImage =
    image.namespaceURI === "http://www.w3.org/2000/svg" && image.localName === "image";
  if (!svgImage && image.localName !== "img") return;
  const source = svgImage ? image.getAttribute("href") : image.currentSrc || image.src;
  if (!source) return;
  const webp = fallbacks.get(absoluteUrl(source)) || image.getAttribute("data-image-webp");
  if (!webp || absoluteUrl(source) === absoluteUrl(webp)) return;

  if (svgImage) {
    image.setAttribute("href", webp);
    return;
  }
  // A picture source overrides img.src, so disable the failed AVIF candidates first.
  if (image.parentElement?.localName === "picture") {
    for (const source of image.parentElement.querySelectorAll('source[type="image/avif"]')) {
      source.removeAttribute("srcset");
    }
  }
  image.removeAttribute("srcset");
  image.src = webp;
};

document.addEventListener(
  "error",
  (event) => {
    if (event.target instanceof Element) useWebpFallback(event.target);
  },
  true,
);

const recoverEarlyImages = () => {
  for (const image of document.images) {
    if (image.complete && image.naturalWidth === 0) useWebpFallback(image);
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", recoverEarlyImages, { once: true });
} else {
  recoverEarlyImages();
}

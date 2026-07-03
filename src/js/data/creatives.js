import postcardImage from "../../assets/creatives/postcard.webp";
import saasoftImage from "../../assets/creatives/saasoft.webp";
import siyayImage from "../../assets/creatives/siyay.webp";
import varwinOpeningVideo from "../../assets/creatives/varwin-opening.mp4";

export const creatives = [
  {
    type: "image",
    src: postcardImage,
    alt: "Postcard creative layout",
    col: 2,
    colSpan: 5,
    row: 2,
    rowSpan: 1,
  },
  {
    type: "video",
    src: varwinOpeningVideo,
    col: 13,
    colSpan: 6,
    row: 3,
    rowSpan: 1,
  },
  {
    type: "image",
    src: saasoftImage,
    alt: "Saasoft creative layout",
    col: 3,
    colSpan: 6,
    row: 4,
    rowSpan: 1,
  },
  {
    type: "image",
    src: siyayImage,
    alt: "Siyay creative layout",
    col: 14,
    colSpan: 6,
    row: 5,
    rowSpan: 1,
  },
];

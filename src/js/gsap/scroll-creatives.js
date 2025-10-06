import { gsap } from "gsap";
import ScrollSmoother from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollSmoother);

window.addEventListener("DOMContentLoaded", () => {
  // Set up a fast setter for skew and clamp the value to avoid extreme angles
  const skewSetter = gsap.quickTo("img", "skewY");
  const clamp = gsap.utils.clamp(-20, 20);

  ScrollSmoother.create({
    wrapper: "#wrapper",
    content: "#content",
    smooth: 2,
    speed: 3,
    effects: true,
    onUpdate: (self) => skewSetter(clamp(self.getVelocity() / -50)),
    onStop: () => skewSetter(0),
  });
});

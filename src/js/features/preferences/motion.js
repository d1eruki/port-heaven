import { useMediaQuery, usePreferredReducedMotion } from "@vueuse/core";
import { computed } from "vue";

const preferredMotion = usePreferredReducedMotion();

export const reducedMotion = computed(() => preferredMotion.value === "reduce");
export const finePointer = useMediaQuery("(pointer: fine)");

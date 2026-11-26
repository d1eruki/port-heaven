<!-- Изображение креатива с адаптивными форматами и кнопкой просмотра из галереи. -->
<template>
  <component
    :is="previewLabel ? 'button' : 'div'"
    class="vanilla-tilt-creatives group block h-fit w-full overflow-hidden hover:z-100"
    :type="previewLabel ? 'button' : undefined"
    :aria-label="previewLabel || undefined"
    :aria-haspopup="previewLabel ? 'dialog' : undefined"
    @click="previewLabel && emit('preview', $event, image)"
  >
    <picture class="contents">
      <source
        v-for="source in imageSources"
        :key="source.type"
        :type="source.type"
        :srcset="source.srcset"
        :sizes="imageSizes"
      />
      <img
        ref="image"
        class="h-auto w-full transition-all duration-1000 ease-in-out effects:max-lg:transform-gpu"
        :src="creativeSrc"
        :alt="creativeAlt"
        :width="imageWidth"
        :height="imageHeight"
        loading="lazy"
        decoding="async"
      />
    </picture>
  </component>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  creativeSrc: { type: String, required: true },
  creativeAlt: { type: String, required: true },
  imageSources: { type: Array, default: () => [] },
  imageSizes: { type: String, required: true },
  imageWidth: { type: Number, default: undefined },
  imageHeight: { type: Number, default: undefined },
  previewLabel: { type: String, default: "" },
});

const emit = defineEmits(["preview"]);
const image = ref(null);
</script>

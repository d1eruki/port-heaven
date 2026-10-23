<!-- Изображение креатива с адаптивными форматами production-сборки. -->
<template>
  <div class="vanilla-tilt-creatives group h-fit overflow-hidden hover:z-100">
    <picture class="contents">
      <source
        v-for="source in imageSources"
        :key="source.type"
        :type="source.type"
        :srcset="source.srcset"
        :sizes="imageSizes"
      />
    <img
      class="h-auto w-full transition-all duration-1000 ease-in-out"
      :src="creativeSrc"
      :alt="creativeAlt"
      :width="imageWidth"
      :height="imageHeight"
      loading="lazy"
      decoding="async"
    />
    </picture>
  </div>
</template>

<script setup>
defineProps({
  creativeSrc: { type: String, required: true },
  creativeAlt: { type: String, required: true },
  imageSources: { type: Array, default: () => [] },
  imageSizes: { type: String, required: true },
  imageWidth: { type: Number, default: undefined },
  imageHeight: { type: Number, default: undefined },
});
</script>

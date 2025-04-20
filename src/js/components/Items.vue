<template>
  <div class="item pointer-events-none flex flex-col rounded-xl p-4 md:pointer-events-auto">
    <div class="mb-4 flex items-center justify-between gap-1">
      <h4>{{ itemName }}</h4>
      <img class="rounded-xl drop-shadow-none" :src="itemImage" :alt="itemImgAlt" />
    </div>
    <p>{{ itemDesc }}</p>
  </div>
</template>

<script setup>
defineProps({
  itemName: {
    type: String,
    required: true,
    default: "Default Title",
  },
  itemDesc: {
    type: String,
    required: true,
    default: "Default Description",
  },
  itemImage: {
    type: String,
    required: true,
    default: "assets/images/default.svg",
  },
  itemImgAlt: {
    type: String,
    required: true,
    default: "Default Image Description",
  },
});
</script>

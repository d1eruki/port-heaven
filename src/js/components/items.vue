<template>
  <a :href="itemUrl" target="_blank" class="item flex flex-col justify-between p-5 outline lg:aspect-square">
    <h4>{{ itemName }}</h4>
    <p>{{ itemDesc }}</p>
  </a>
</template>

<script setup>
const props = defineProps({
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
  itemUrl: {
    type: String,
    required: true,
    default: "https://www.youtube.com/",
  },
});
</script>

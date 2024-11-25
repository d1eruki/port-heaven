<template>
  <div class="item rounded-xl p-4 flex flex-col md:pointer-events-auto pointer-events-none">
    <div class="flex justify-between items-center mb-4 gap-1">
      <h2>{{ itemName }}</h2>
      <img class="drop-shadow-none rounded-xl" :src="itemImage" :alt="itemImgAlt">
    </div>
    <p>{{ itemDesc }}</p>
  </div>
</template>

<script>
export default {
  name: "Items",
  props: {
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
      default: 'Default Image Description'
    }
  }
};
</script>

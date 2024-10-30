<template>
  <div class="item flex flex-col">
    <div class="itemName flex justify-between items-center mb-4">
      <h2>{{ itemName }}</h2>
      <img class="shadowless" :src="itemImage" :alt="itemImgAlt">
    </div>
    <p>{{ itemDesc }}</p>
  </div>
</template>

<script>
export default {
  name: "DesignItem",
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
}
</script>

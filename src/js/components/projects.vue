<template>
  <div class="item light:bg-[var(--white)] project absolute col-span-1 flex w-full flex-col gap-5 rounded-t-4xl will-change-transform border border-solid border-black">
    <div class="flex flex-col justify-between gap-5 h-full p-5">
      <h3 class="lg:w-[80%]">{{ projectName }}</h3>
      <p class="">{{ projectDescription }}</p>
      <div class="flex h-fit w-full justify-end gap-5">
        <a v-for="(link, index) in projectLinks" :key="index" class="active custom-button flex w-full items-center justify-center rounded-4xl px-5 py-5 lg:px-10" :href="link.url" target="_blank">
          <p>{{ link.name }}</p>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  projectName: {
    type: String,
    required: true,
    default: "Default Title",
  },
  projectDescription: String,
  projectResult: String,
  projectStatistic: Array,
  projectLinks: {
    type: Array,
    default: () => [],
  },
});
</script>

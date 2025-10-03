<template>
  <div class="project col-span-1 flex flex-col rounded-4xl border border-solid border-white lg:h-full">
    <div class="flex h-full flex-col justify-between gap-5 p-5">
      <h3>{{ projectName }}</h3>
      <p>{{ projectDescription }}</p>
      <div class="flex h-fit w-full justify-end">
        <a v-for="(link, index) in projectLinks" :key="index" class="active custom-button flex w-full items-center justify-center px-5 py-5 lg:px-10" :href="link.url" target="_blank">
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

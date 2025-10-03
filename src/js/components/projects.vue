<template>
  <div class="item light:bg-[var(--white)]  project absolute col-span-1 flex w-full flex-col gap-5 rounded-4xl border border-solid border-black will-change-transform">
    <div class="flex h-full flex-col justify-between gap-5 p-15">
      <h3 class="lg:w-[80%]">{{ projectName }}</h3>
      <p class="">{{ projectDescription }}</p>
      <div class="flex h-fit w-fit flex-col justify-end gap-10">
        <a v-for="(link, index) in projectLinks" :key="index" class="active custom-button flex w-full" :href="link.url" target="_blank">
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

<template>
  <div @click="openModal" class="swiper-slide item flex! h-auto! flex-col!">
    <div class="flex h-full flex-col justify-between gap-5 p-5">
      <h3>{{ projectName }}</h3>
      <p>{{ projectDescription }}</p>
      <p class="flex items-center justify-center px-5 py-5 lg:px-10">Подробнее</p>
    </div>

    <div ref="modalContent" style="display: none">
      <div class="flex flex-col gap-5 p-5">
        <h3>{{ t("projects-stat-after-launch") }}</h3>
        <p>{{ projectResult }}</p>
        <div class="flex flex-col gap-2">
          <div v-for="(statistic, index) in projectStatistic" :key="index" class="flex items-center gap-3">
            <icons class="hidden text-[var(--grey)]!" icon="star" />
            <p>{{ statistic }}</p>
          </div>
        </div>
      </div>
      <div class="flex h-fit w-full justify-end">
        <a
          v-for="(link, index) in projectLinks"
          :key="index"
          class="custom-button w-full flex items-center justify-center px-5 py-5 lg:px-10"
          :href="link.url"
          target="_blank"
        >
          <p>{{ link.name }}</p>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import MicroModal from "micromodal";
import Icons from "./icons.vue";

const { t } = useI18n();

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

const modalContent = ref(null);

function openModal() {
  const target = document.getElementById("modal-content");
  if (target && modalContent.value) {
    target.innerHTML = "";

    const clone = modalContent.value.cloneNode(true);

    // Убираем display: none
    clone.style.display = "block";

    target.appendChild(clone);

    MicroModal.show("modal");
  }
}
</script>

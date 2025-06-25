<template>
  <div @click="openModal" class="swiper-slide item-project flex! h-auto! flex-col!">
    <div class="flex flex-col justify-between gap-5 p-5">
      <h3>{{ projectName }}</h3>
      <p>{{ projectDescription }}</p>
    </div>

    <div ref="modalContent">
      <div class="flex flex-col gap-5 p-5">
        <h4>{{ t("projects-stat-after-launch") }}</h4>
        <p>{{ projectResult }}</p>

        <div class="flex flex-col gap-2">
          <div v-for="(statistic, index) in projectStatistic" :key="index" class="flex items-center gap-3">
            <icons class="hidden text-[var(--grey)]!" icon="star" />
            <p>{{ statistic }}</p>
          </div>
        </div>

        <div class="flex h-fit w-full justify-end">
          <customButton class="w-full" v-for="(link, index) in projectLinks" :key="index" :url="link.url" :name="link.name" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import MicroModal from "micromodal";
import customButton from "./custom-button.vue";
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
  const target = document.getElementById("modal-1-content");
  if (target && modalContent.value) {
    target.innerHTML = "";
    target.appendChild(modalContent.value.cloneNode(true));
    MicroModal.show("modal-1");
  }console.log(modalContent.value)
}
</script>

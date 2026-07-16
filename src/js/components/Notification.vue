<template>
  <aside
    v-if="isVisible"
    class="fixed right-5 bottom-20 left-5 z-300 grid gap-5 bg-inverse p-5 text-inverse-fg lg:right-15 lg:bottom-15 lg:left-auto lg:w-150"
    aria-live="polite"
    aria-labelledby="analytics-notification-title"
    aria-describedby="analytics-notification-text"
  >
    <div class="grid gap-2">
      <h4 id="analytics-notification-title">{{ t("privacy.analytics.title") }}</h4>
      <p id="analytics-notification-text">{{ t("privacy.analytics.text") }}</p>
    </div>
    <div class="flex flex-wrap gap-5">
      <button
        type="button"
        class="anim-extrude active bg-accent-section px-5 py-2.5 text-accent-section-fg"
        @click="emit('accept')"
      >
        <small>{{ t("privacy.analytics.accept") }}</small>
      </button>
      <button
        type="button"
        class="text-action-muted hover:text-inverse-fg"
        @click="emit('decline')"
      >
        <small>{{ t("privacy.analytics.decline") }}</small>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();
defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["accept", "decline"]);
</script>

<template>
  <aside
    v-if="isVisible"
    class="fixed right-5 bottom-20 left-5 z-300 grid gap-5 rounded-3xl bg-inverse p-5 text-on-inverse lg:right-15 lg:bottom-15 lg:left-auto lg:w-150"
    aria-live="polite"
    aria-labelledby="analytics-notification-title"
    aria-describedby="analytics-notification-text"
  >
    <div class="grid gap-2">
      <h4 id="analytics-notification-title">{{ t("privacy.analytics.title") }}</h4>
      <p id="analytics-notification-text">{{ t("privacy.analytics.text") }}</p>
    </div>
    <div class="flex flex-wrap gap-5">
      <Button
        variant="primary"
        size="compact"
        @click="emit('accept')"
      >
        {{ t("privacy.analytics.accept") }}
      </Button>
      <Button
        variant="secondary"
        size="compact"
        @click="emit('decline')"
      >
        {{ t("privacy.analytics.decline") }}
      </Button>
    </div>
  </aside>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import Button from "./Button.vue";

const { t } = useI18n();
defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["accept", "decline"]);
</script>

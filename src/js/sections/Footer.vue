<template>
  <footer
    data-section="footer"
    id="footer"
    class="flex min-h-svh w-full max-w-full min-w-0 flex-col justify-end gap-5 overflow-hidden p-10 lg:p-15"
  >
    <div class="max-w-full min-w-0 items-baseline gap-10 lg:flex">
      <a
        class="group relative w-auto font-heading text-link hover:text-link-hover"
        href="https://t.me/d1eruki"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2 class="inline-flex items-baseline gap-2 text-nowrap">
          <span
            class="icon-[ic--baseline-telegram] aspect-square"
            aria-hidden="true"
          ></span
          >{{ t("contacts.telegram") }}
        </h2>
        <div
          class="absolute -bottom-30 left-15 z-2 hidden -rotate-15 rounded-2xl bg-inverse p-5 font-heading text-on-inverse lg:group-hover:block"
        >
          https://t.me/d1eruki
        </div>
      </a>
      <a
        class="group relative w-auto font-heading text-link hover:text-link-hover"
        href="https://www.behance.net/dieruki"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2 class="inline-flex items-baseline gap-2 text-nowrap">
          <span
            class="icon-[eva--behance-fill]"
            aria-hidden="true"
          ></span
          >{{ t("contacts.behance") }}
        </h2>
        <div
          class="absolute -bottom-40 -left-25 z-2 hidden rotate-45 rounded-2xl bg-inverse p-5 font-heading text-on-inverse lg:group-hover:block"
        >
          BEHANCE
        </div>
      </a>
      <MenuDescription :menu-desc="t('menu.footer.description')" />
    </div>
    <div class="relative left-1/2 z-1 flex w-screen -translate-x-1/2 justify-center">
      <div
        ref="footerLogoRef"
        class="inline-block w-max max-w-none font-heading text-5xl leading-none font-black text-nowrap text-accent lowercase"
      >
        {{ t("brand.logo") }}
      </div>
    </div>
  </footer>
</template>

<script setup>
import fitty from "fitty";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import MenuDescription from "../components/MenuDescription.vue";

const { t } = useI18n();

const footerLogoRef = ref(null);
let footerLogoFit;

onMounted(() => {
  footerLogoFit = fitty(footerLogoRef.value, {
    minSize: 1,
    maxSize: Number.POSITIVE_INFINITY,
    multiLine: false,
  });

  document.fonts.ready.then(() => footerLogoFit?.fit());
});

onBeforeUnmount(() => {
  footerLogoFit?.unsubscribe();
  footerLogoFit = null;
});
</script>

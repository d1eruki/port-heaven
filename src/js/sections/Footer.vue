<template>
  <footer
    data-section="footer"
    id="footer"
    class="flex min-h-svh flex-col justify-end gap-5 p-15"
  >
    <div class="items-center gap-10 lg:flex">
      <a
        class="group relative w-auto font-[Actay_Wide] text-action-muted hover:text-fg"
        href="https://t.me/d1eruki"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2 class="flex gap-2 text-nowrap">
          <span
            class="icon-[ic--baseline-telegram] aspect-square"
            aria-hidden="true"
          ></span
          >{{ t("contacts.telegram") }}
        </h2>
        <div
          class="absolute -bottom-30 left-15 hidden -rotate-15 bg-inverse p-5 font-[Actay_Wide] text-inverse-fg lg:group-hover:block"
        >
          https://t.me/d1eruki
        </div>
      </a>
      <a
        class="group relative w-auto font-[Actay_Wide] text-action-muted hover:text-fg"
        href="https://www.behance.net/dieruki"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2 class="flex gap-2 text-nowrap">
          <span
            class="icon-[eva--behance-fill]"
            aria-hidden="true"
          ></span
          >{{ t("contacts.behance") }}
        </h2>
        <div
          class="absolute -bottom-40 -left-25 hidden rotate-45 bg-inverse p-5 font-[Actay_Wide] text-inverse-fg lg:group-hover:block"
        >
          BEHANCE
        </div>
      </a>
      <a
        class="group relative w-auto font-[Actay_Wide] text-action-muted hover:text-fg"
        href="mailto:stapps90@gmail.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2 class="flex gap-2 text-nowrap">
          <span
            class="icon-[ic--baseline-alternate-email] aspect-square"
            aria-hidden="true"
          ></span
          >{{ t("contacts.mail") }}
        </h2>
        <div
          class="absolute -bottom-40 -left-25 hidden rotate-45 bg-inverse p-5 font-[Actay_Wide] text-inverse-fg lg:group-hover:block"
        >
          stapps90@gmail.com
        </div>
      </a>
      <MenuDescription :menu-desc="t('menu.footer.description')" />
    </div>
    <h2 class="footer-logo-text font-[Actay_Wide] text-nowrap text-accent lowercase">
      {{ t("brand.logo") }}
    </h2>
  </footer>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import MenuDescription from "../components/MenuDescription.vue";

const { t } = useI18n();
</script>

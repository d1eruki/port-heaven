<template>
  <section
    id="pricing"
    data-section="pricing"
    class="relative isolate min-h-svh overflow-hidden bg-inverse px-0 pt-18 pb-9 text-inverse-fg lg:px-15 lg:py-32"
  >
    <div class="mx-auto w-full max-w-360">
      <header class="relative grid min-h-37.5 lg:min-h-72">
        <h2
          class="absolute inset-x-0 bottom-[-0.08em] z-0 text-center text-[clamp(5.5rem,29vw,8rem)] tracking-tighter whitespace-nowrap text-inverse-fg lowercase lg:bottom-[-0.17em] lg:text-[clamp(8rem,23vw,22rem)]"
          :aria-label="t('menu.pricing.title')"
        >
          {{ t("menu.pricing.title") }}
        </h2>
      </header>

      <div class="relative z-2 grid grid-cols-1 items-start gap-5 xl:grid-cols-3 xl:items-stretch">
        <article
          v-for="plan in pricingPlans"
          :key="plan.id"
          class="flex min-w-0 flex-col overflow-hidden bg-accent text-on-accent"
        >
          <div
            class="grid min-w-0 content-start gap-5 border-b border-on-accent/20 p-15 xl:h-90 xl:flex-none"
          >
            <div class="flex items-center justify-between gap-5">
              <h3 class="min-w-0 text-2xl wrap-anywhere normal-case lg:text-3xl">
                {{ plan.name }}
              </h3>
            </div>
            <p class="min-w-0 leading-snug wrap-anywhere text-on-accent/60">
              {{ plan.description }}
            </p>
            <div class="flex w-full min-w-0 items-baseline gap-2">
              <span class="flex-none text-sm text-on-accent/60">{{
                t("pricing.pricePrefix")
              }}</span>
              <strong
                class="flex min-w-0 items-baseline gap-2 font-heading text-5xl leading-none font-black tracking-tighter whitespace-nowrap tabular-nums"
              >
                {{ plan.price }}
                <span class="flex-none text-2xl text-on-accent/60">{{
                  t("pricing.currency")
                }}</span>
              </strong>
            </div>
            <small class="min-w-0 wrap-anywhere text-on-accent/70">{{ plan.duration }}</small>
          </div>

          <div class="grid min-w-0 flex-1 content-start p-15">
            <ul class="grid gap-3.5">
              <li
                v-if="plan.includes"
                class="flex min-w-0 items-center gap-5 text-xs leading-snug font-black text-on-accent"
              >
                <span
                  class="block size-2 flex-none rounded-full bg-on-accent"
                  aria-hidden="true"
                ></span>
                <span class="min-w-0 wrap-anywhere">{{ plan.includes }}</span>
              </li>
              <li
                v-else
                class="invisible flex min-w-0 items-center gap-5 text-xs leading-snug font-black text-on-accent"
                aria-hidden="true"
              >
                <span class="block size-2 flex-none rounded-full bg-on-accent"></span>
                <span class="min-w-0">&nbsp;</span>
              </li>
              <li
                v-for="feature in plan.features"
                :key="feature"
                class="flex min-w-0 items-center gap-5 text-xs leading-snug text-on-accent/75"
              >
                <span
                  class="block size-2 flex-none rounded-full bg-on-accent"
                  aria-hidden="true"
                ></span>
                <span class="min-w-0 wrap-anywhere">{{ feature }}</span>
              </li>
            </ul>
          </div>
        </article>
      </div>

      <div class="mt-9 flex justify-center px-5 lg:px-0">
        <a
          class="anim-extrude active flex w-full justify-center bg-accent px-5 py-2.5 text-center text-on-accent lg:w-fit lg:px-10 lg:py-5"
          href="https://t.me/d1eruki"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="font-heading">{{ t("pricing.action") }}</span>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const planDefinitions = [
  {
    id: "base",
    name: "Base",
    price: "5 000",
    featureCount: 4,
  },
  {
    id: "advanced",
    name: "Advanced",
    price: "15 000",
    featureCount: 5,
    includesPlan: "base",
  },
  {
    id: "pro",
    name: "Pro",
    price: "30 000",
    featureCount: 5,
    includesPlan: "advanced",
  },
];

const pricingPlans = computed(() =>
  planDefinitions.map((plan) => ({
    ...plan,
    description: t(`pricing.plans.${plan.id}.description`),
    duration: t(`pricing.plans.${plan.id}.duration`),
    includes: plan.includesPlan
      ? t("pricing.includes", {
          plan: planDefinitions.find(({ id }) => id === plan.includesPlan).name,
        })
      : null,
    features: Array.from({ length: plan.featureCount }, (_, index) =>
      t(`pricing.plans.${plan.id}.features.${index}`),
    ),
  })),
);
</script>

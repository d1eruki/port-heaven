<template>
  <section
    id="pricing"
    data-section="pricing"
    class="pricing-section"
  >
    <div class="pricing-shell">
      <header class="pricing-header">
        <h2
          class="pricing-display"
          :aria-label="t('menu.pricing.title')"
        >
          {{ t("menu.pricing.title") }}
        </h2>
      </header>

      <div class="pricing-grid">
        <article
          v-for="plan in pricingPlans"
          :key="plan.id"
          class="pricing-card"
        >
          <div class="pricing-card-head">
            <div class="pricing-plan-row">
              <h3 class="pricing-plan-title">{{ plan.name }}</h3>
            </div>
            <p>{{ plan.description }}</p>
            <div class="pricing-cost">
              <span>{{ t("pricing.pricePrefix") }}</span>
              <strong>{{ plan.price }}</strong>
              <span>{{ t("pricing.currency") }}</span>
            </div>
            <small>{{ plan.duration }}</small>
          </div>

          <div class="pricing-card-body">
            <ul>
              <li
                v-if="plan.includes"
                class="pricing-includes-item"
              >
                <span
                  class="pricing-check"
                  aria-hidden="true"
                ></span>
                {{ plan.includes }}
              </li>
              <li
                v-else
                class="pricing-includes-item pricing-includes-placeholder"
                aria-hidden="true"
              >
                <span class="pricing-check"></span>
                &nbsp;
              </li>
              <li
                v-for="feature in plan.features"
                :key="feature"
              >
                <span
                  class="pricing-check"
                  aria-hidden="true"
                ></span>
                {{ feature }}
              </li>
            </ul>
          </div>
        </article>
      </div>

      <div class="pricing-action">
        <a
          class="anim-extrude flex w-fit bg-primary px-5 py-2.5 text-accent-section-fg lg:px-10 lg:py-5"
          href="https://t.me/d1eruki"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="font-[Actay_Wide]">{{ t("pricing.action") }}</span>
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
    price: "35 000",
    featureCount: 4,
  },
  {
    id: "advanced",
    name: "Advanced",
    price: "75 000",
    featureCount: 5,
    includesPlan: "base",
  },
  {
    id: "pro",
    name: "Pro",
    price: "145 000",
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

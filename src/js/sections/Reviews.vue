<!-- Отзывы в виде скриншотов на фоне холма с облаками. -->
<template>
  <section
    id="reviews"
    data-section="reviews"
    class="relative isolate flex min-h-svh bg-canvas p-section text-primary max-lg:pt-section-gap max-lg:pb-0"
  >
    <div
      class="relative isolate grid min-h-[max(32rem,140vw)] w-full flex-1 grid-cols-1 grid-rows-[1fr_1fr_auto_1fr_1fr] items-center justify-items-center gap-related overflow-hidden rounded-4xl bg-surface-subtle px-panel py-content sm:min-h-[110vw] lg:min-h-[max(36rem,80svh,36vw)] lg:grid-cols-3 lg:grid-rows-[1fr_auto_1fr] lg:gap-panel"
    >
      <picture class="contents">
        <source
          v-for="source in background.sources"
          :key="source.type"
          :type="source.type"
          :srcset="source.srcset"
          sizes="calc(100vw - 5rem)"
        />
        <img
          data-reviews-background
          :src="background.src"
          alt=""
          width="800"
          height="600"
          loading="lazy"
          decoding="async"
          class="absolute -top-[20%] left-0 -z-10 h-[140%] w-full max-w-none object-cover lg:object-fill"
        />
      </picture>
      <div
        class="pointer-events-none relative z-10 row-start-3 py-panel lg:col-start-2 lg:row-start-2"
      >
        <h2 class="rounded-full bg-canvas px-panel py-3 text-center lowercase">
          {{ t("menu.reviews.title") }}
        </h2>
      </div>
      <div
        v-for="review in reviews"
        :key="review.src"
        :style="review.style"
        :class="review.layout"
        class="w-4/5 sm:w-3/5 lg:w-full"
      >
        <picture class="contents">
          <source
            v-for="source in review.sources"
            :key="source.type"
            :type="source.type"
            :srcset="source.srcset"
            sizes="(min-width: 1024px) calc((100vw - 17.5rem) / 3), (min-width: 640px) calc((100vw - 7.5rem) * 0.6), calc((100vw - 7.5rem) * 0.8)"
          />
          <img
            :src="review.src"
            :alt="review.alt"
            :width="review.width"
            :height="review.height"
            loading="lazy"
            decoding="async"
            class="block h-auto w-full rotate-[var(--review-rotation)] rounded-xl shadow-xl"
          />
        </picture>
      </div>
    </div>
    <picture
      class="pointer-events-none absolute top-0 right-0 z-1 block w-28 select-none lg:right-5 lg:w-52"
      aria-hidden="true"
    >
      <source
        v-for="source in chromeBlob.sources"
        :key="source.type"
        :type="source.type"
        :srcset="source.srcset"
        sizes="(min-width: 1024px) 208px, 112px"
      />
      <img
        ref="chromeRef"
        :src="chromeBlob.src"
        alt=""
        :width="chromeBlob.width"
        :height="chromeBlob.height"
        loading="lazy"
        decoding="async"
        draggable="false"
        class="block h-auto w-full rotate-12"
      />
    </picture>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import background from "../../assets/reviews/background.png?responsive";
import chromeBlob from "../../assets/chrome/chrome-blob.png?responsive";
import { createReviews } from "../data/reviews";
import { useChromeFloat } from "../features/effects/chrome-float";

const { t } = useI18n();
const reviews = createReviews();
const chromeRef = ref(null);
useChromeFloat(chromeRef, "blob");
</script>

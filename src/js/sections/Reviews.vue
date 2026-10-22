<!-- Отзывы в виде скриншотов на фоне холма с облаками. -->
<template>
  <section
    id="reviews"
    data-section="reviews"
    class="relative flex min-h-svh bg-canvas p-10 text-primary lg:p-15"
  >
    <div
      class="relative isolate min-h-[max(32rem,140vw)] w-full flex-1 overflow-hidden rounded-4xl bg-surface-subtle sm:min-h-[110vw] lg:min-h-[max(36rem,80svh,36vw)]"
    >
      <img
        data-reviews-background
        :src="background"
        alt=""
        width="800"
        height="600"
        loading="lazy"
        decoding="async"
        class="absolute -top-[20%] left-0 -z-10 h-[140%] w-full max-w-none object-cover lg:object-fill"
      />
      <div class="pointer-events-none absolute inset-0 z-10 grid place-items-center px-5">
        <h2 class="rounded-full bg-canvas px-5 py-3 text-center lowercase">
          {{ t("menu.reviews.title") }}
        </h2>
      </div>
      <div class="absolute inset-0">
        <div
          v-for="review in reviews"
          :key="review.src"
          :style="review.style"
          class="absolute top-[var(--review-top)] bottom-[var(--review-bottom)] left-[var(--review-left)] w-[68%] sm:w-[60%] lg:top-[var(--review-desktop-top)] lg:bottom-[var(--review-desktop-bottom)] lg:left-[var(--review-desktop-left)] lg:w-[32%]"
        >
          <img
            :src="review.src"
            :alt="review.alt"
            :width="review.width"
            :height="review.height"
            loading="lazy"
            decoding="async"
            class="block h-auto w-full rotate-[var(--review-rotation)] rounded-xl shadow-xl"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import background from "../../assets/reviews/background.png";
import review1 from "../../assets/reviews/review-1.jpg";
import review2 from "../../assets/reviews/review-2.jpg";
import review3 from "../../assets/reviews/review-3.jpg";
import review4 from "../../assets/reviews/review-4.jpg";

const { t } = useI18n();
const randomBetween = (min, max) => min + Math.random() * (max - min);
const reviews = [
  {
    src: review1,
    width: 961,
    height: 311,
    alt: "diemxn: шрифт имба, сайт уже хвалят, шеф вроде даже доволен",
  },
  {
    src: review2,
    width: 982,
    height: 278,
    alt: "diemxn: я ваще со всей графики которую ты сделал разъебываюсь",
  },
  {
    src: review3,
    width: 1047,
    height: 307,
    alt: "Иван Нестеров: хотел у тебя часы купить, чтоб ты обучалку провёл",
  },
  {
    src: review4,
    width: 1024,
    height: 304,
    alt: "Влад Кошенков: в целом круто сделано, супер дотошно, я не ожидал такого",
  },
]
  .map((review) => ({ review, order: Math.random() }))
  .sort((a, b) => a.order - b.order)
  .map(({ review }, index) => ({
    ...review,
    style: {
      "--review-top": index < 2 ? `${12 + index * 15 + randomBetween(-1, 1)}%` : "auto",
      "--review-bottom": index > 1 ? `${11 + (3 - index) * 15 + randomBetween(-1, 1)}%` : "auto",
      "--review-left": `${index % 2 ? randomBetween(24, 26) : randomBetween(6, 8)}%`,
      "--review-desktop-top": index < 2 ? `${12 + index * 10 + randomBetween(-2, 2)}%` : "auto",
      "--review-desktop-bottom":
        index > 1 ? `${10 + (3 - index) * 10 + randomBetween(-2, 2)}%` : "auto",
      "--review-desktop-left": `${index % 2 ? randomBetween(53, 57) : randomBetween(12, 16)}%`,
      "--review-rotation": `${randomBetween(-3, 3)}deg`,
    },
  }));
</script>

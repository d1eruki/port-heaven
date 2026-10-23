import review1 from "../../assets/reviews/review-1.jpg?responsive";
import review2 from "../../assets/reviews/review-2.jpg?responsive";
import review3 from "../../assets/reviews/review-3.jpg?responsive";
import review4 from "../../assets/reviews/review-4.jpg?responsive";

export const createReviews = () => {
  const randomBetween = (min, max) => min + Math.random() * (max - min);
  return [
    {
      ...review1,
      alt: "diemxn: шрифт имба, сайт уже хвалят, шеф вроде даже доволен",
    },
    {
      ...review2,
      alt: "diemxn: я ваще со всей графики которую ты сделал разъебываюсь",
    },
    {
      ...review3,
      alt: "Иван Нестеров: хотел у тебя часы купить, чтоб ты обучалку провёл",
    },
    {
      ...review4,
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
};

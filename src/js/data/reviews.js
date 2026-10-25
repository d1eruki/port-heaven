import review1 from "../../assets/reviews/review-1.jpg?responsive";
import review3 from "../../assets/reviews/review-3.jpg?responsive";
import review4 from "../../assets/reviews/review-4.jpg?responsive";
import review5 from "../../assets/reviews/review-5.png?responsive";

export const createReviews = () => {
  const randomBetween = (min, max) => min + Math.random() * (max - min);
  const positions = [
    { top: 4, left: 16, desktopTop: 7, desktopLeft: 34 },
    { top: 19, left: 2, desktopTop: 34, desktopLeft: 4 },
    { bottom: 56, left: 30, desktopTop: 34, desktopLeft: 64 },
    { bottom: 8, left: 7, desktopBottom: 9, desktopLeft: 16 },
    { bottom: 23, left: 25, desktopBottom: 9, desktopLeft: 52 },
  ];
  return [
    {
      ...review1,
      alt: "diemxn: шрифт имба, сайт уже хвалят, шеф вроде даже доволен",
    },
    {
      ...review3,
      alt: "Иван Нестеров: хотел у тебя часы купить, чтоб ты обучалку провёл",
    },
    {
      ...review4,
      alt: "Влад Кошенков: в целом круто сделано, супер дотошно, я не ожидал такого",
    },
    {
      ...review5,
      alt: "Саша Багдоян: но реально кайфово, оч яркая страничка для детей вышла веселая",
    },
  ]
    .map((review) => ({ review, order: Math.random() }))
    .sort((a, b) => a.order - b.order)
    .map(({ review }, index) => ({
      ...review,
      style: {
        "--review-top": positions[index].top == null ? "auto" : `${positions[index].top}%`,
        "--review-bottom": positions[index].bottom == null ? "auto" : `${positions[index].bottom}%`,
        "--review-left": `${positions[index].left}%`,
        "--review-desktop-top":
          positions[index].desktopTop == null ? "auto" : `${positions[index].desktopTop}%`,
        "--review-desktop-bottom":
          positions[index].desktopBottom == null ? "auto" : `${positions[index].desktopBottom}%`,
        "--review-desktop-left": `${positions[index].desktopLeft}%`,
        "--review-rotation": `${randomBetween(-3, 3)}deg`,
      },
    }));
};

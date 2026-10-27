import review1 from "../../assets/reviews/review-1.jpg?responsive";
import review3 from "../../assets/reviews/review-3.jpg?responsive";
import review4 from "../../assets/reviews/review-4.jpg?responsive";
import review5 from "../../assets/reviews/review-5.png?responsive";

export const createReviews = () => {
  const positions = [
    { layout: "row-start-1 lg:col-start-2 lg:row-start-1", rotation: -2 },
    { layout: "row-start-2 lg:col-start-1 lg:row-start-2", rotation: 2 },
    { layout: "row-start-4 lg:col-start-3 lg:row-start-2", rotation: -2 },
    { layout: "row-start-5 lg:col-start-2 lg:row-start-3", rotation: 2 },
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
      layout: positions[index].layout,
      style: {
        "--review-rotation": `${positions[index].rotation}deg`,
      },
    }));
};

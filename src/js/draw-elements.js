function drawStar(el, outerRadius = 80, innerRadius = 35) {
  if (!el) return;
  outerRadius = Number(outerRadius) || 80;
  innerRadius = Number(innerRadius) || 35;
  const numPoints = 13;
  const points = [];
  for (let i = 0; i < numPoints * 2; i++) {
    const angle = (Math.PI * 2 * i) / (numPoints * 2);
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    points.push(`${x},${y}`);
  }
  el.setAttribute("points", points.join(" "));
}

// Найдём все звёзды (только polygon)
const stars = document.querySelectorAll("polygon.star");

// Нарисуем их
stars.forEach(drawStar);

// При прокрутке крутим
window.addEventListener("scroll", () => {
  const deg = window.scrollY * 0.5;
  stars.forEach((star) => {
    star.style.transform = `rotate(${deg}deg)`;
  });
});

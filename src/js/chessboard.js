export const generateChessboard = () => {
  const chess = document.querySelector(".chess");
  let htmlContent = "";
  let currentCube = "cube-one";

  for (let i = 0; i < 324; i++) {
    if (i > 0 && i % 18 === 0) {
      htmlContent += `<div class="${currentCube}"></div>`;
    } else {
      currentCube = currentCube === "cube-one" ? "cube-two" : "cube-one";
      htmlContent += `<div class="${currentCube}"></div>`;
    }
  }

  chess.innerHTML = htmlContent;
};

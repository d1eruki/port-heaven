function updateGrid() {
  const cellCount = 10; // сколько клеток хочешь по ширине
  const size = window.innerWidth / cellCount;
  document.documentElement.style.setProperty("--cell", `${size}px`);
}

window.addEventListener("resize", updateGrid);
updateGrid();

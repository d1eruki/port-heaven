import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from "chart.js";

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const ctx = document.getElementById("radar");

new Chart(ctx, {
  type: "radar",
  data: {
    labels: ["UX/UI", "Web", "Mobile", "Graph", "Motion", "3D"],
    datasets: [
      {
        label: "Demo",
        data: [4, 4, 3, 1, 2, 1],
        fill: true,
        backgroundColor: "hsla(0, 0%, 0%, 0.1)",
        borderColor: getComputedStyle(document.documentElement).getPropertyValue("--color-black").trim(),
        pointBackgroundColor: getComputedStyle(document.documentElement).getPropertyValue("--color-black").trim(),
      },
    ],
  },
  options: {
    devicePixelRatio: 5,
    plugins: { legend: { display: false } },
    scales: {
      r: {
        beginAtZero: true,
        suggestedMax: 5,
        ticks: {
          stepSize: 1,
          precision: 0,
          callback: (v) => (Number.isInteger(v) ? v : null),
        },
        grid: { color: "rgba(0,0,0,0.1)" },
        angleLines: { color: "rgba(0,0,0,0.15)" },
      },
    },
  },
});

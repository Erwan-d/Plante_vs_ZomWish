// src/ui/main-ui.js
import PlantBar from "./PlantBar.js";

const { createApp } = Vue; // vient du script global dans game.html

const app = createApp({
  data() {
    return {
      selectedPlant: null
    };
  },
  components: {
    PlantBar
  }
});

const vm = app.mount("#app");

// gestion du drop sur la zone Phaser
const dropzone = document.getElementById("grid-dropzone");

dropzone.addEventListener("dragover", e => e.preventDefault());
dropzone.addEventListener("dragenter", e => e.preventDefault());
dropzone.addEventListener("drop", e => {
  const plantKey = e.dataTransfer.getData("plantKey");
  if (!plantKey) return;

  const rect = dropzone.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const rows = 5;
  const visibleCols = 5;
  const cellH = rect.height / rows;
  const cellW = rect.width / visibleCols;

  const col = Math.floor(x / cellW);
  const row = Math.floor(y / cellH);

  if (row < 0 || row >= rows || col < 0 || col >= visibleCols) return;

  if (window.phaserPlaceUnit) {
    window.phaserPlaceUnit(row, col, plantKey);
  }
});

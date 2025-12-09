// src/ui/main-ui.js
import PlantBar from "./PlantBar.js";

const { createApp } = Vue;

const app = createApp({
  data() {
    return { selectedPlant: null };
  },
  components: { PlantBar }
});

const vm = app.mount("#app");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM prêt, configuration du drag & drop...");

  const dropzone = document.getElementById("grid-dropzone");
  if (!dropzone) {
    console.error("#grid-dropzone NON TROUVÉ !");
    return;
  }

  console.log("Dropzone trouvée:", dropzone);

  dropzone.style.pointerEvents = "auto";

// event drag&drop
  dropzone.addEventListener("dragover", e => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
  });

  dropzone.addEventListener("dragenter", e => {
    e.preventDefault();
    e.stopPropagation();
  });

  dropzone.addEventListener("dragleave", e => {});

  dropzone.addEventListener("drop", e => {
    e.preventDefault();
    e.stopPropagation();
    console.log("DROP détecté !");

    const plantKey = e.dataTransfer.getData("plantKey");
    console.log("Plante:", plantKey);

    if (!plantKey) {
      console.error(" plantKey manquant");
      return;
    }

    if (!window.phaserScene || !window.phaserScene.convertPointerToGrid) {
      console.error(" Phaser pas encore prêt");
      return;
    }

    // === coordonnées drag&drop
    const rect = dropzone.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top;

    console.log(" Drop coord:", x, y);

    // place sur la grille
    const cell = window.phaserScene.convertPointerToGrid(x, y);

    if (!cell) {
      console.warn(" Drop en dehors de la grille Phaser");
      return;
    }

    console.log("Case détectée:", cell.row, cell.col);

    // ===  place sur la cases correspondantes
    window.phaserPlaceUnit(cell.row, cell.col, plantKey);
  });

  console.log(" Drag & Drop réussi");
});

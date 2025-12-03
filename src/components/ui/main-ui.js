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

// ← ATTENDRE QUE LE DOM SOIT PRÊT
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM prêt, config drop...");
  
  const dropzone = document.getElementById("grid-dropzone");
  if (!dropzone) {
    console.error("❌ #grid-dropzone NON TROUVÉ");
    return;
  }
  
  console.log("✅ Dropzone trouvée:", dropzone);

  // ← FIX 1: Empêcher tout pointer-events sur les enfants
  dropzone.style.pointerEvents = "auto";
  dropzone.style.background = "rgba(255,0,0,0.1)"; // ← DEBUG VISUEL (enlève après)

  // ← FIX 2: Events avec VERROUILLAGE complet
  dropzone.addEventListener("dragover", e => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
    console.log("🔄 dragover !");
  }, false);

  dropzone.addEventListener("dragenter", e => {
    e.preventDefault();
    e.stopPropagation();
    console.log("➡️ dragenter !");
  }, false);

  dropzone.addEventListener("dragleave", e => {
    console.log("⬅️ dragleave");
  }, false);

  dropzone.addEventListener("drop", e => {
    e.preventDefault();
    e.stopPropagation();
    console.log("💥 DROP !");

    const plantKey = e.dataTransfer.getData("plantKey");
    console.log("🌱 plantKey:", plantKey);

    if (!plantKey || !window.phaserPlaceUnit) {
      console.error("❌ plantKey ou Phaser manquant");
      return;
    }

    const rect = dropzone.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    console.log("📍 x:", x, "y:", y, "w:", rect.width, "h:", rect.height);

    const rows = 5, cols = 5;
    const row = Math.floor(y / (rect.height / rows));
    const col = Math.floor(x / (rect.width / cols));

    console.log("🎯 row:", row, "col:", col);

    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      window.phaserPlaceUnit(row, col, plantKey);
    }
  }, false);

  console.log("✅ Dropzone configurée");
});

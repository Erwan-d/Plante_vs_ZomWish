<template>
  <div id="game-container"
       @dragover.prevent
       @drop="onDrop">
  </div>
</template>

<script>
import Phaser from "phaser";
import GameScene from "../phaser/GameScene.js";

export default {
  name: "Game",

  mounted() {
    this.game = new Phaser.Game({
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: "game-container",
      scene: [GameScene]
    });
  },

  methods: {
    onDrop(event) {
      const plantId = event.dataTransfer.getData("plant");

      if (!plantId) return;

      // Coordinates in Phaser
      const rect = event.target.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Send drop to Phaser Scene
      window.dispatchEvent(new CustomEvent("plantDropped", {
        detail: { plantId, x, y }
      }));
    }
  }
};
</script>

<style>
#game-container {
  width: 800px;
  height: 600px;
  margin: auto;
  border: 3px solid red; /* Visible */
}
</style>


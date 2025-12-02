<template>
  <div id="game-container"></div>
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
  }
};
</script>

<style>
#game-container {
  width: 800px;
  height: 600px;
  margin: auto;
  border: 3px solid red;
}
</style>







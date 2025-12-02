// Comme Phaser est global via CDN, pas d'import nécessaire
// Juste la config et initialise la scène
import GameScene from "../phaser/GameScene.js";

const config = {
  type: Phaser.AUTO,
  width: 600,
  height: 600,
  parent: "game-container",
  backgroundColor: "#000000",
  scene: [GameScene],  // Assure-toi que GameScene est bien dans le scope global ou ajouté correctement
};

const game = new Phaser.Game(config);
window.phaserGame = game;



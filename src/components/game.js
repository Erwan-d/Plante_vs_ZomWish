// Comme Phaser est global via CDN, pas d'import nécessaire
// Juste la config et initialise la scène
import GameScene from "../phaser/GameScene.js";

const config = {
    type: Phaser.AUTO,
    parent: "game-container",

    scale: {
        mode: Phaser.Scale.RESIZE,      // <-- s'adapte à toute la zone dispo
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    backgroundColor: "#000000",
    scene: [GameScene],
};

new Phaser.Game(config);



import GameScene from "../phaser/GameScene.js";

const config = {
    type: Phaser.AUTO,
    parent: "game-container",

    scale: {
        mode: Phaser.Scale.RESIZE,      
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    backgroundColor: "#000000",
    scene: [GameScene],
};

new Phaser.Game(config);


// ---------------------------------------------------------------------------
// GAME.JS — version améliorée avec vrai drag & drop + duplication de plantes
// ---------------------------------------------------------------------------

class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }

    preload() {
        // Chargement des assets
        this.load.image("tournesol", "style/images/tournesol.png");
        this.load.image("pisto", "style/images/pistopoix.png");
    }

    create() {

        // ----- PARAMÈTRES GRILLE -----
        this.rows = 5;
        this.cols = 5;
        this.cellSize = 120;

        const gridSize = this.cellSize * this.cols;
        const startX = (this.game.config.width - gridSize) / 2;
        const startY = (this.game.config.height - gridSize) / 2;

        this.grid = [];

        // ----- GRILLE VISIBLE -----
        for (let r = 0; r < this.rows; r++) {
            this.grid[r] = [];

            for (let c = 0; c < this.cols; c++) {

                const x = startX + c * this.cellSize + this.cellSize / 2;
                const y = startY + r * this.cellSize + this.cellSize / 2;

                const rect = this.add.rectangle(
                    x, y,
                    this.cellSize - 4,
                    this.cellSize - 4,
                    0xff0000,   // rouge
                    0.25
                )
                .setStrokeStyle(3, 0xffffff)
                .setInteractive({ dropZone: true });

                this.grid[r][c] = { rect, plant: null };
            }
        }

        // ----- PALETTE PLANTES -----
        this.createPalette();

        // ----- DRAG GLOBAL -----
        this.input.on("drag", (pointer, obj, x, y) => {
            obj.x = x;
            obj.y = y;
        });

        // ----- DROP GLOBAL -----
        this.input.on("drop", (pointer, obj, zone) => {
            this.placePlant(obj, zone);
        });

        // ----- DRAG END -----
        this.input.on("dragend", (pointer, obj, dropped) => {
            if (!dropped && obj.isClone) {
                obj.destroy(); // clone rejeté → supprimé
            }
        });
    }

    // ---------------------------------------------------------------
    // PALETTE : chaque sprite de la palette génère un clone draggable
    // ---------------------------------------------------------------
    createPalette() {

        const plants = [
            { key: "tournesol", y: 150 },
            { key: "pisto", y: 350 }
        ];

        plants.forEach(p => {
            const base = this.add.image(120, p.y, p.key)
                .setScale(0.8)
                .setInteractive();

            // → On ne drague PAS l'image de base
            base.on("pointerdown", () => {
                this.spawnClone(p.key, base.x + 140, base.y);
            });
        });
    }

    // ---------------------------------------------------------------
    // CRÉE UN CLONE DRAGGABLE D’UNE PLANTE
    // ---------------------------------------------------------------
    spawnClone(key, x, y) {

        const clone = this.add.image(x, y, key)
            .setScale(0.8)
            .setInteractive();

        clone.isClone = true;

        this.input.setDraggable(clone);

        // Animation de pop
        this.tweens.add({
            targets: clone,
            scale: 0.9,
            duration: 120,
            yoyo: true
        });
    }

    // ---------------------------------------------------------------
    // POSE UNE PLANTE DANS UNE CASE
    // ---------------------------------------------------------------
    placePlant(sprite, dropZone) {

        // Trouver la zone correspondante dans la grille
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {

                if (this.grid[r][c].rect === dropZone) {

                    // Si déjà occupée → retour + suppression clone
                    if (this.grid[r][c].plant) {
                        if (sprite.isClone) sprite.destroy();
                        return;
                    }

                    // Centrage exact
                    sprite.x = dropZone.x;
                    sprite.y = dropZone.y;

                    // Verrouillage
                    this.input.setDraggable(sprite, false);
                    sprite.isClone = false;

                    // Marquer la case occupée
                    this.grid[r][c].plant = sprite;

                    return;
                }
            }
        }
    }
}

// ---------------------------------------------------------
// CONFIG PHASER
// ---------------------------------------------------------
const config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 700,
    parent: "game-container",
    backgroundColor: "#000000",
    scene: [GameScene]
};

new Phaser.Game(config);



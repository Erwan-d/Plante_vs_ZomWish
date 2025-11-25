import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");

        // taille grille
        this.gridSize = 5;

        // Taille case
        this.cellSize = 100;

        // Tableau 
        this.grid = [];
    }

    create() {
        // visuel
        this.drawGrid();
    }

    // dessine sur écran
    drawGrid() {
        for (let row = 0; row < this.gridSize; row++) {

        
            this.grid[row] = [];

            for (let col = 0; col < this.gridSize; col++) {

                this.grid[row][col] = null;

                //rectangle pour chaque cases
                this.add.rectangle(
                    col * this.cellSize + this.cellSize / 2,
                    row * this.cellSize + this.cellSize / 2,
                    this.cellSize,
                    this.cellSize,
                    0x000000,
                    0.1 
                ).setStrokeStyle(2, 0xffffff); 
            }
        }
    }

    // Fonction appelée par Vue pour placer une plante dans la grille
    placePlant(row, col) {

        // Empêche de placer une plante sur une case occupée
        if (this.grid[row][col] !== null) return false;

        // Création d'une plante (un cercle vert)
        const plant = this.add.circle(
            col * this.cellSize + this.cellSize / 2,
            row * this.cellSize + this.cellSize / 2,
            40,          // rayon du cercle
            0x00ff00     // couleur verte
        );

        // On stocke la plante dans la grille logique
        this.grid[row][col] = plant;

        return true;
    }
}


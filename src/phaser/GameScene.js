import ZombieWaveManager from "../components/ZombieWaveManager.js";
import { ZOMBIES } from "../assets/zombies/index.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");

    this.rows = 5;

    this.visibleCols = 5;   // colonnes jouables visibles
    this.extraCols = 2;     // colonnes de marge pour le spawn
    this.cols = this.visibleCols + this.extraCols;

    this.cellSize = 120;
    this.grid = [];
    this.zombieGroup = null;

    // facteur d'étirement horizontal ( > 1 = plus large )
    this.stretchFactor = 1.4;
  }

  preload() {
    this.load.image("gridBg", "src/styles/image/gridBg.png");

    ZOMBIES.forEach(zombie => {
      this.load.image(zombie.key, "src/assets/zombies/sprites/" + zombie.sprite);
    });
    this.load.image("bg","src/styles/image/bg.png")
  }

create() {
  console.log("🎮 GameScene - create() START");

  // ← DIMENSIONS CALCULÉES UNE SEULE FOIS
  const width  = this.scale.width;
  const height = this.scale.height;
  this.cellSize = height / this.rows;

  const visibleSize   = this.visibleCols * this.cellSize;
  const stretchedSize = visibleSize * this.stretchFactor;
  const startX = (width - stretchedSize) / 2;
  const startY = 0;

  console.log("📏 Dimensions:", width, "x", height, "cellSize:", this.cellSize);

  // ← FOND GLOBAL (pleine écran)
  const background = this.add.image(0, 0, "bg")
    .setOrigin(0, 0)
    .setDepth(-999);
  background.setDisplaySize(width, height);

  // ← BACKGROUND GRILLE
  const bg = this.add.image(
    startX + stretchedSize / 2,
    startY + (this.rows * this.cellSize) / 2,
    "gridBg"
  );
  bg.setDisplaySize(stretchedSize, this.rows * this.cellSize);
  bg.setDepth(-10);

  // ← GRILLE VISUELLE
  this.gridGraphics = this.add.graphics({ x: 0, y: 0 });
  this.gridGraphics.lineStyle(2, 0xffffff, 0.8);
  
  // Bordure grille
  this.gridGraphics.strokeRect(startX, startY, stretchedSize, this.rows * this.cellSize);

  // Lignes verticales
  for (let i = 1; i < this.visibleCols; i++) {
    const x = startX + (i * stretchedSize) / this.visibleCols;
    this.gridGraphics.moveTo(x, startY);
    this.gridGraphics.lineTo(x, startY + this.rows * this.cellSize);
  }

  // Lignes horizontales
  for (let j = 1; j < this.rows; j++) {
    const y = startY + j * this.cellSize;
    this.gridGraphics.moveTo(startX, y);
    this.gridGraphics.lineTo(startX + stretchedSize, y);
  }
  this.gridGraphics.strokePath();

  // ← GRILLE LOGIQUE (5x7)
  this.grid = [];
  for (let r = 0; r < this.rows; r++) {
    this.grid[r] = [];
    for (let c = 0; c < this.cols; c++) {
      this.grid[r][c] = null;
    }
  }

  // ← GROUPES
  this.zombieGroup = this.add.group();

  // ← CRUCIAL #1 : window.phaserPlaceUnit DÉFINI EN PRIORITÉ
  window.phaserPlaceUnit = (row, col, type) => {
    console.log("🌱 PHASER PLACEMENT:", row, col, type);
    if (this.placeUnit(row, col, type)) {
      console.log("✅ Plante placée:", type, "en", row, col);
    }
  };
  console.log("✅ window.phaserPlaceUnit défini");

  // ← CRUCIAL #2 : Écouteur CustomEvent (backup)
  window.addEventListener("place-unit", e => {
    console.log("📡 CustomEvent place-unit:", e.detail);
    this.placeUnit(e.detail.row, e.detail.col, e.detail.type);
  });

  // ← VAGUES
  const waves = [
    { count: 5, types: ZOMBIES.map(z => z.key), interval: 1500 },
    { count: 8, types: ZOMBIES.map(z => z.key), interval: 1200 },
    { count: 10, types: ZOMBIES.map(z => z.key), interval: 1000 }
  ];

  this.zombieWaveManager = new ZombieWaveManager(this, waves);
  this.zombieWaveManager.startWaves();

  // ← CRUCIAL #3 : Signal Phaser prêt
  console.log("✅ PHASER PRÊT - Grille:", this.rows, "x", this.cols, "- Drag&Drop OK");
}




  placeUnit(row, col, type) {
    if (col >= this.visibleCols) return;
    if (this.grid[row][col]) return;

    const width  = this.scale.gameSize.width;
    const height = this.scale.gameSize.height;
    this.cellSize = height / this.rows;

    const visibleSize   = this.visibleCols * this.cellSize;
    const stretchedSize = visibleSize * this.stretchFactor;
    const startX = (width - stretchedSize) / 2;
    const startY = 0;

    const cellWidth = stretchedSize / this.visibleCols;

    const x = startX + col * cellWidth + cellWidth / 2;
    const y = startY + row * this.cellSize + this.cellSize / 2;

    const unit = this.add.image(x, y, type).setScale(0.8);
    this.grid[row][col] = unit;
  }

  spawnZombie(typeKey) {
    const zombie = ZOMBIES.find(z => z.key === typeKey);
    if (!zombie) return;

    const row = Phaser.Math.Between(0, this.rows - 1);

    const width  = this.scale.gameSize.width;
    const height = this.scale.gameSize.height;
    this.cellSize = height / this.rows;

    const visibleSize   = this.visibleCols * this.cellSize;
    const stretchedSize = visibleSize * this.stretchFactor;
    const startX = (width - stretchedSize) / 2;

    const cellWidth = stretchedSize / this.visibleCols;

    // spawn après les colonnes visibles + colonnes de marge
    const spawnX = startX + (this.visibleCols + this.extraCols) * cellWidth;
    const y = row * this.cellSize + this.cellSize / 2;

    const sprite = this.add.image(spawnX, y, zombie.key).setScale(0.8);
    sprite.hp = zombie.hp;
    sprite.speed = zombie.speed;

    this.zombieGroup.add(sprite);

    sprite.takeDamage = dmg => {
      sprite.hp -= dmg;
      if (sprite.hp <= 0) this.removeZombie(sprite);
    };
  }

  removeZombie(zombieSprite) {
    if (!zombieSprite) return;
    zombieSprite.destroy();
    this.zombieGroup.remove(zombieSprite);
    this.zombieWaveManager.onZombieRemoved?.();
  }

  update() {
    this.zombieGroup.getChildren().forEach(zombie => {
      zombie.x -= zombie.speed;
      if (zombie.x < -50) this.removeZombie(zombie);
    });
  }
}


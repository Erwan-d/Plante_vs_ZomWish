import ZombieWaveManager from "../components/ZombieWaveManager.js";
import { ZOMBIES } from "../assets/zombies/index.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.rows = 5;
    this.cols = 5;
    this.cellSize = 120;
    this.grid = [];
    this.zombieGroup = null;
  }

  preload() {
    // Charge les images des zombies au format global Phaser
    ZOMBIES.forEach(zombie => {
      this.load.image(zombie.key, "src/assets/zombies/sprites/" + zombie.sprite);

    });
  }

  create() {
    console.log("create called");

    const gSize = this.cellSize * this.cols;
    const startX = (this.game.config.width - gSize) / 2;
    const startY = (this.game.config.height - gSize) / 2;

    this.gridGraphics = this.add.graphics();
    this.gridGraphics.lineStyle(2, 0xffffff, 1);

    // Trace le cadre
    this.gridGraphics.strokeRect(startX, startY, gSize, gSize);

    // Trace verticale des lignes de la grille
    for (let i = 1; i < this.cols; i++) {
      this.gridGraphics.moveTo(startX + i * this.cellSize, startY);
      this.gridGraphics.lineTo(startX + i * this.cellSize, startY + gSize);
    }

    // Trace horizontale des lignes de la grille
    for (let j = 1; j < this.rows; j++) {
      this.gridGraphics.moveTo(startX, startY + j * this.cellSize);
      this.gridGraphics.lineTo(startX + gSize, startY + j * this.cellSize);
    }

    this.gridGraphics.strokePath();

    // Initialise la grille logique (null pour cases vides)
    for (let r = 0; r < this.rows; r++) {
      this.grid[r] = [];
      for (let c = 0; c < this.cols; c++) {
        this.grid[r][c] = null;
      }
    }

    this.zombieGroup = this.add.group();

    window.addEventListener("place-unit", e => {
      this.placeUnit(e.detail.row, e.detail.col, e.detail.type);
    });
    window.phaserPlaceUnit = (row, col, type) => this.placeUnit(row, col, type);

    const waves = [
      { count: 5, types: ZOMBIES.map(z => z.key), interval: 1500 },
      { count: 8, types: ZOMBIES.map(z => z.key), interval: 1200 },
      { count: 10, types: ZOMBIES.map(z => z.key), interval: 1000 }
    ];

    this.zombieWaveManager = new ZombieWaveManager(this, waves);
    this.zombieWaveManager.startWaves();
  }

  placeUnit(row, col, type) {
    if (this.grid[row][col]) return;

    const gSize = this.cellSize * this.cols;
    const startX = (this.game.config.width - gSize) / 2;
    const startY = (this.game.config.height - gSize) / 2;

    const x = startX + col * this.cellSize + this.cellSize / 2;
    const y = startY + row * this.cellSize + this.cellSize / 2;

    const unit = this.add.image(x, y, type).setScale(0.8);
    this.grid[row][col] = unit;
  }

  spawnZombie(typeKey) {
    const zombie = ZOMBIES.find(z => z.key === typeKey);
    if (!zombie) return;

    const row = Phaser.Math.Between(0, this.rows - 1);
    const gSize = this.cellSize * this.cols;
    const startX = (this.game.config.width - gSize) / 2;

    const x = startX + gSize + 40;
    const y = (row * this.cellSize) + this.cellSize / 2;

    const sprite = this.add.image(x, y, zombie.key).setScale(0.8);
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
  }

  update() {
    this.zombieGroup.getChildren().forEach(zombie => {
      zombie.x -= zombie.speed;
      if (zombie.x < -50) this.removeZombie(zombie);
    });
  }
}

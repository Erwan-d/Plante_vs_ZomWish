import ZombieWaveManager from "../components/ZombieWaveManager.js";
import { ZOMBIES } from "../assets/zombies/index.js";
import { Pistopoix, Tournesol } from "../assets/plantes/index.js";
const PLANTS = [Pistopoix, Tournesol];


export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");

    this.rows = 5;

    this.visibleCols = 5;   
    this.extraCols = 2;     
    this.cols = this.visibleCols + this.extraCols;

    this.cellSize = 120;
    this.grid = [];
    this.zombieGroup = null;

    this.stretchFactor = 1.4;
  }

preload() {
  this.load.image("gridBg", "src/styles/image/gridBg.png");


  ZOMBIES.forEach(zombie => {
    this.load.image(zombie.key, "src/assets/zombies/sprites/" + zombie.sprite);
  });
  PLANTS.forEach(plant => {
    this.load.image(
      plant.key,
      "src/assets/plantes/" + plant.spriteIdle
    );
    this.load.image(
      plant.key + "_icon",
      "src/assets/plantes/" + plant.icon
    );
    if (plant.projectile) {
      this.load.image(
        plant.key + "_projectile",
        "src/assets/plantes/" + plant.projectile
      );
    }
  });

  this.load.image("bg", "src/styles/image/bg.png");
}


  create() {
    console.log("🎮 GameScene - create() START");

    //  scène pour drag&drop
    window.phaserScene = this;

    const width  = this.scale.width;
    const height = this.scale.height;
    this.cellSize = height / this.rows;

    const visibleSize   = this.visibleCols * this.cellSize;
    const stretchedSize = visibleSize * this.stretchFactor;
    const startX = (width - stretchedSize) / 2;
    const startY = 0;

    // Background
    const background = this.add.image(0, 0, "bg")
      .setOrigin(0, 0)
      .setDepth(-999);
    background.setDisplaySize(width, height);

    // Background grille
    const bg = this.add.image(
      startX + stretchedSize / 2,
      startY + (this.rows * this.cellSize) / 2,
      "gridBg"
    );
    bg.setDisplaySize(stretchedSize, this.rows * this.cellSize);
    bg.setDepth(-10);

    // visuelle grille
    this.gridGraphics = this.add.graphics({ x: 0, y: 0 });
    this.gridGraphics.lineStyle(2, 0xffffff, 0.8);

    this.gridGraphics.strokeRect(startX, startY, stretchedSize, this.rows * this.cellSize);

    for (let i = 1; i < this.visibleCols; i++) {
      const x = startX + (i * stretchedSize) / this.visibleCols;
      this.gridGraphics.moveTo(x, startY);
      this.gridGraphics.lineTo(x, startY + this.rows * this.cellSize);
    }

    for (let j = 1; j < this.rows; j++) {
      const y = startY + j * this.cellSize;
      this.gridGraphics.moveTo(startX, y);
      this.gridGraphics.lineTo(startX + stretchedSize, y);
    }
    this.gridGraphics.strokePath();

    // Grille
    this.grid = [];
    for (let r = 0; r < this.rows; r++) {
      this.grid[r] = [];
      for (let c = 0; c < this.cols; c++) {
        this.grid[r][c] = null;
      }
    }

    this.zombieGroup = this.add.group();

    // Placement 
    window.phaserPlaceUnit = (row, col, type) => {
      if (this.placeUnit(row, col, type)) {
        console.log("Plante placée :", type, "en", row, col);
      }
    };

    window.addEventListener("place-unit", e => {
      this.placeUnit(e.detail.row, e.detail.col, e.detail.type);
    });

    // Vagues 
    const waves = [
      { count: 5, types: ZOMBIES.map(z => z.key), interval: 1500 },
      { count: 8, types: ZOMBIES.map(z => z.key), interval: 1200 },
      { count: 10, types: ZOMBIES.map(z => z.key), interval: 1000 }
    ];

    this.zombieWaveManager = new ZombieWaveManager(this, waves);
    this.zombieWaveManager.startWaves();
  }

  // drag&drop logique 
  convertPointerToGrid(x, y) {
    const width  = this.scale.gameSize.width;
    const height = this.scale.gameSize.height;

    const cellSize = height / this.rows;
    const visibleSize   = this.visibleCols * cellSize;
    const stretchedSize = visibleSize * this.stretchFactor;
    const startX = (width - stretchedSize) / 2;
    const startY = 0;

    if (x < startX || x > startX + stretchedSize) return null;
    if (y < startY || y > startY + this.rows * cellSize) return null;

    const cellWidth = stretchedSize / this.visibleCols;

    const col = Math.floor((x - startX) / cellWidth);
    const row = Math.floor((y - startY) / cellSize);

    if (col < 0 || col >= this.visibleCols) return null;
    if (row < 0 || row >= this.rows) return null;

    return { row, col };
  }

placeUnit(row, col, type) {
  if (col >= this.visibleCols) return;
  if (this.grid[row][col]) return;

  if (!this.textures.exists(type)) {
    console.error(` Sprite manquant pour la plante : "${type}"`);
    return;
  }


  const width  = this.scale.gameSize.width;
  const height = this.scale.gameSize.height;
  this.cellSize = height / this.rows;

  const visibleSize   = this.visibleCols * this.cellSize;
  const stretchedSize = visibleSize * this.stretchFactor;
  const startX = (width - stretchedSize) / 2;

  const cellWidth = stretchedSize / this.visibleCols;


  const x = startX + col * cellWidth + cellWidth / 2;
  const y = row * this.cellSize + this.cellSize / 2;


  const plantSprite = this.add.image(x, y, type)
    .setOrigin(0.5)
    .setScale(0.85);

  
  this.grid[row][col] = plantSprite;

  console.log(` Plante "${type}" placée en (${row}, ${col})`);
}

 // spawn zombie
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



import ZombieWaveManager from "../components/ZombieWaveManager.js";
import ProjectilesManager from "../components/ProjectilesManager.js";
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
    this.projectilesManager = null;

    this.stretchFactor = 1.4;
  }

  preload() {
    this.load.image("zombie_death", "src/assets/zombies/sprites/dead.png");

    // fond de grille
    this.load.image("gridBg", "src/styles/image/gridBg.png");

    // zombies
    ZOMBIES.forEach(zombie => {
      this.load.image(
        zombie.key,
        "src/assets/zombies/sprites/" + zombie.sprite
      );
    });

    // plantes + icônes + projectiles
    PLANTS.forEach(plant => {
      // sprite de la plante sur la grille
      this.load.image(
        plant.key,
        "src/assets/plantes/" + plant.spriteIdle
      );

      // icône pour la barre de plantes
      this.load.image(
        plant.key + "_icon",
        "src/assets/plantes/" + plant.icon
      );

      // projectile (ex: "pistopoix/poix.png")
      if (plant.projectile) {
        this.load.image(
          plant.key + "_projectile",                    // ex: "pistopoix_projectile"
          "src/assets/plantes/" + plant.projectile      // ex: "src/assets/plantes/pistopoix/poix.png"
        );
      }
    });

    // fond global
    this.load.image("bg", "src/styles/image/bg.png");
  }

  create() {
    console.log("🎮 GameScene - create() START");

    // scène pour drag&drop
    window.phaserScene = this;

    const width  = this.scale.width;
    const height = this.scale.height;
    this.cellSize = height / this.rows;

    const visibleSize   = this.visibleCols * this.cellSize;
    const stretchedSize = visibleSize * this.stretchFactor;
    const startX        = (width - stretchedSize) / 2;
    const startY        = 0;

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

    // Grille visuelle
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

    // Grille logique
    this.grid = [];
    for (let r = 0; r < this.rows; r++) {
      this.grid[r] = [];
      for (let c = 0; c < this.cols; c++) {
        this.grid[r][c] = null;
      }
    }

    // Groupes
    this.zombieGroup        = this.add.group();
    this.projectilesManager = new ProjectilesManager(this);

    // Placement via fonction globale (main-ui peut l'appeler)
    window.phaserPlaceUnit = (row, col, type) => {
      this.placeUnit(row, col, type);
    };

    // Placement via CustomEvent
    window.addEventListener("place-unit", e => {
      const { row, col, type } = e.detail;
      this.placeUnit(row, col, type);
    });

    // Vagues de zombies
    const waves = [
      { count: 5, types: ZOMBIES.map(z => z.key), interval: 1500 },
      { count: 8, types: ZOMBIES.map(z => z.key), interval: 1200 },
      { count: 10, types: ZOMBIES.map(z => z.key), interval: 1000 }
    ];

    this.zombieWaveManager = new ZombieWaveManager(this, waves);
    this.zombieWaveManager.startWaves();

    console.log("✅ GameScene prête");
  }

  // drag&drop logique
  convertPointerToGrid(x, y) {
    const width  = this.scale.gameSize.width;
    const height = this.scale.gameSize.height;

    const cellSize      = height / this.rows;
    const visibleSize   = this.visibleCols * cellSize;
    const stretchedSize = visibleSize * this.stretchFactor;
    const startX        = (width - stretchedSize) / 2;
    const startY        = 0;

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
  if (col >= this.visibleCols) return false;
  if (this.grid[row][col]) return false;

  if (!this.textures.exists(type)) {
    console.error(`Sprite manquant pour la plante : "${type}"`);
    return false;
  }

  const width  = this.scale.gameSize.width;
  const height = this.scale.gameSize.height;
  this.cellSize = height / this.rows;

  const visibleSize   = this.visibleCols * this.cellSize;
  const stretchedSize = visibleSize * this.stretchFactor;
  const startX        = (width - stretchedSize) / 2;

  const cellWidth = stretchedSize / this.visibleCols;

  const x = startX + col * cellWidth + cellWidth / 2;
  const y = row * this.cellSize + this.cellSize / 2;

  const sprite = this.add.image(x, y, type)
    .setOrigin(0.5)
    .setScale(0.85);

  // PV de base selon le type de plante (à ajuster)
  let hp = 100;
  if (type === "pistopoix") hp = 120;
  if (type === "tournesol") hp = 80;

  this.grid[row][col] = { sprite, type, hp, row, col };

  // tirs des plantes
  if (type === "pistopoix" && typeof Pistopoix.onPlaced === "function") {
    Pistopoix.onPlaced(this, row, col);
  } else if (type === "tournesol" && typeof Tournesol.onPlaced === "function") {
    Tournesol.onPlaced(this, row, col);
  }

  console.log(`Plante "${type}" placée en (${row}, ${col}) avec ${hp} HP`);
  return true;
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
  const startX        = (width - stretchedSize) / 2;

  const cellWidth = stretchedSize / this.visibleCols;

  const spawnX = startX + (this.visibleCols + this.extraCols) * cellWidth;
  const y      = row * this.cellSize + this.cellSize / 2;

  const sprite = this.add.image(spawnX, y, zombie.key).setScale(0.8);
  sprite.hp     = zombie.hp;
  sprite.speed  = zombie.speed;
  sprite.row    = row;
  sprite.attack = zombie.attack || 10; // dégâts de base à définir dans ZOMBIES

  this.zombieGroup.add(sprite);

  sprite.takeDamage = dmg => {
    sprite.hp -= dmg;
    if (sprite.hp <= 0) this.removeZombie(sprite);
  };
}


 removeZombie(zombieSprite) {
  if (!zombieSprite) return;


  const deathX = zombieSprite.x;
  const deathY = zombieSprite.y;


  const deathSprite = this.add.image(deathX, deathY, "zombie_death")
    .setScale(0.8); 


  this.time.delayedCall(2000, () => {
    if (deathSprite && deathSprite.destroy) {
      deathSprite.destroy();
    }
  });

  zombieSprite.destroy();
  this.zombieGroup.remove(zombieSprite);
  this.zombieWaveManager.onZombieRemoved?.();
}


update(time, delta) {
  this.zombieGroup.getChildren().forEach(zombie => {
    const row = zombie.row ?? 0;
    const width  = this.scale.gameSize.width;
    const height = this.scale.gameSize.height;
    const cellSize = height / this.rows;

    const visibleSize   = this.visibleCols * cellSize;
    const stretchedSize = visibleSize * this.stretchFactor;
    const startX        = (width - stretchedSize) / 2;
    const cellWidth     = stretchedSize / this.visibleCols;

    const col = Math.floor((zombie.x - startX) / cellWidth);

    const plantCell =
      row >= 0 && row < this.rows && col >= 0 && col < this.visibleCols
        ? this.grid[row][col]
        : null;

    if (plantCell && plantCell.sprite && plantCell.hp > 0) {
      // zombie attaque la plante
      if (!zombie.nextAttackTime || time >= zombie.nextAttackTime) {
        zombie.nextAttackTime = time + 1000; // 1 attaque / seconde

        plantCell.hp -= zombie.attack;

        if (plantCell.hp <= 0) {
          // ⚠️ ARRÊTER LES TIRS DE LA PLANTE ICI
          if (plantCell.type === "pistopoix" && typeof Pistopoix.onRemove === "function") {
            Pistopoix.onRemove();
          } else if (plantCell.type === "tournesol" && typeof Tournesol.onRemove === "function") {
            Tournesol.onRemove();
          }

          plantCell.sprite.destroy();
          this.grid[row][col] = null;
        }
      }
      // zombie ne bouge pas pendant qu'il tape
    } else {
      // pas de plante devant → avance
      zombie.x -= zombie.speed;
      if (zombie.x < -50) this.removeZombie(zombie);
    }
  });

  if (this.projectilesManager) {
    this.projectilesManager.update();
  }
}
}

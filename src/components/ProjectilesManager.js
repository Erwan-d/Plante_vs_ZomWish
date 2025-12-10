// src/components/ProjectilesManager.js
export default class ProjectilesManager {
  constructor(scene) {
    this.scene = scene;
    this.projectiles = scene.add.group();
  }

  fireFromPlant(plantDef, row, col) {
    const scene = this.scene;
    const { rows, visibleCols, stretchFactor } = scene;

    const width  = scene.scale.gameSize.width;
    const height = scene.scale.gameSize.height;
    const cellSize = height / rows;

    const visibleSize   = visibleCols * cellSize;
    const stretchedSize = visibleSize * stretchFactor;
    const startX        = (width - stretchedSize) / 2;
    const startY        = 0;

    const cellWidth  = stretchedSize / visibleCols;
    const cellHeight = cellSize;

    const x = startX + col * cellWidth  + cellWidth  / 2;
    const y = startY + row * cellHeight + cellHeight / 2;

    const textureKey = plantDef.key + "_projectile"; // "pistopoix_projectile"

    console.log("🚀 fireFromPlant", { textureKey });

    if (!scene.textures.exists(textureKey)) {
      console.error("❌ texture projectile inconnue:", textureKey);
      return;
    }

    const proj = scene.add.image(x, y, textureKey).setScale(0.7);
    proj.damage = plantDef.damage || 0;
    proj.row    = row;

    this.projectiles.add(proj);
  }

  update() {
    const scene = this.scene;
    const width = scene.scale.gameSize.width;
    const speed = 8;

    this.projectiles.getChildren().forEach(proj => {
      proj.x += speed;

      scene.zombieGroup.getChildren().forEach(zombie => {
        const dx = zombie.x - proj.x;
        const dy = zombie.y - proj.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 30) {
          const dmg = proj.damage || 0;
          if (typeof zombie.takeDamage === "function") {
            zombie.takeDamage(dmg);
          } else {
            zombie.hp = (zombie.hp || 0) - dmg;
            if (zombie.hp <= 0 && scene.removeZombie) {
              scene.removeZombie(zombie);
            }
          }

          proj.destroy();
          this.projectiles.remove(proj);
        }
      });

      if (proj.x > width + 50) {
        proj.destroy();
        this.projectiles.remove(proj);
      }
    });
  }
}


export default {
  key: "pistopoix",
  name: "Pistopoix",
  cost: 100,
  hp: 250,
  type: "shooter",
  icon: "pistopoix/icon.png",
  spriteIdle: "pistopoix/pistopoix.png",
  projectile: "pistopoix/poix.png",
  shootInterval: 1500,                    // 1,5 sec
  damage: 20,

  onPlaced(game, x, y) {
    this.shootIntervalID = setInterval(() => {
      game.spawnProjectile(x, y, this.damage);
    }, this.shootInterval);
  },

  onRemove() {
    if (this.shootIntervalID) clearInterval(this.shootIntervalID);
  }
};

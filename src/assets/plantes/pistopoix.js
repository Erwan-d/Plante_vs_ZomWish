export default {
  key: "pistopoix",
  name: "Pistopoix",
  cost: 100,
  hp: 250,
  type: "shooter",
  icon: "pistopoix/icon.png",
  spriteIdle: "pistopoix/pistopoix.png",         // Anim d'attente
  shootInterval: 1500,                    // 1,5 sec
  damage: 20,

  onPlaced(game, x, y) {
    this.shootIntervalID = setInterval(() => {
      game.spawnProjectile(x, y, this.damage);
      // code : switch anim à spriteAction puis retour spriteIdle après tir
    }, this.shootInterval);
  },

  onRemove() {
    if (this.shootIntervalID) clearInterval(this.shootIntervalID);
  }
};

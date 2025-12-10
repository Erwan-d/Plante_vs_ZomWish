export default {
  key : "tournesol",
  name: "Tournesol",
  cost: 50,
  hp: 250,
  type: "support",
  icon: "tournesol/icon.png",
  spriteIdle: "tournesol/tournesol.png",       // Animation d'attente
  produceInterval: 1500, //1.5 sec                  
  onPlaced(game, x, y) {
    
    this.sunInterval = setInterval(() => {
      game.resourceManager.addSun(25);
    }, this.produceInterval);
  },

 
  onRemove() {
    if (this.sunInterval) clearInterval(this.sunInterval);
  }
};

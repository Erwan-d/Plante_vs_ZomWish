export default {
  key : "tournesol",
  name: "Tournesol",
  cost: 50,
  hp: 300,
  type: "support",
  icon: "tournesol/icon.png",
  spriteIdle: "tournesol/tournesol.png",       // Animation d'attente
  produceInterval: 2000,                  

  /**
   * Appelé à la pose sur la grille.
   * Lance la génération périodique de ressources soleil.
   */
  onPlaced(game, x, y) {
    // Timer maison, sauvegardé si besoin pour annulation/removal
    this.sunInterval = setInterval(() => {
      game.resourceManager.addSun(25);
    }, this.produceInterval);
  },

  /**
   * Appelé quand la plante est détruite.
   */
  onRemove() {
    if (this.sunInterval) clearInterval(this.sunInterval);
  }
};

export default {
  name: "Tournesol",
  cost: 50,
  hp: 300,
  type: "support",
  spriteIdle: "sprites/tournesol_idle.gif",       // Animation d'attente
  spriteAction: "sprites/tournesol_produce.gif",  // Animation production soleil
  produceInterval: 5000,                  // 5 sec

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

export default {
  key: "pistopoix",
  name: "Pisto-pois",
  cost: 100,
  hp: 1,
  icon: "pistopoix/icon.png",
  spriteIdle: "pistopoix/pistopoix.png",
  projectile: "pistopoix/poix.png",
  shootInterval: 1500,
  damage: 0,

onPlaced(scene, row, col) {
  console.log("🟢 pistopoix.onPlaced appelé", { row, col, sceneHasManager: !!scene.projectilesManager });

  this.shootIntervalID = setInterval(() => {
    console.log("🟡 pistopoix interval tick", { hasManager: !!scene.projectilesManager });

    if (scene.projectilesManager) {
      console.log("🔵 appel fireFromPlant depuis pistopoix");
      scene.projectilesManager.fireFromPlant(this, row, col);
    }
  }, this.shootInterval);
},


  onRemove() {
    if (this.shootIntervalID) {
      clearInterval(this.shootIntervalID);
    }
  }
};


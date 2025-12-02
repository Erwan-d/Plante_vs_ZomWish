export default class ZombieWaveManager {
  /**
   * @param {Phaser.Scene} scene - La scène Phaser
   * @param {Array<Object>} waves - Liste des vagues, chaque vague = { count, types, interval }
   */
  constructor(scene, waves) {
    this.scene = scene;
    this.waves = waves;
    this.currentWaveIndex = 0;
    this.spawned = 0;
    this.waveInProgress = false;
  }

  startWaves() {
    this.currentWaveIndex = 0;
    this.launchWave();
  }

  launchWave() {
    if (this.currentWaveIndex >= this.waves.length) return; // Fin du jeu ou boucle

    const wave = this.waves[this.currentWaveIndex];
    this.spawned = 0;
    this.waveInProgress = true;

    this.scene.time.addEvent({
      delay: wave.interval,
      repeat: wave.count - 1,
      callback: () => this.spawnZombie(wave),
      callbackScope: this
    });

    this.spawnZombie(wave); // Spawn 1er zombie directement

    // Optionnel : déclencher next wave après x secondes ou all zombies morts
    setTimeout(() => {
      this.currentWaveIndex++;
      this.launchWave();
    }, wave.interval * wave.count + 2000); // Buffer avant vague suivante
  }

  spawnZombie(wave) {
    // Tirage d'un type de zombie aléatoire dans wave.types
    const zombieType = wave.types[
      Math.floor(Math.random() * wave.types.length)
    ];
    // Appel de la méthode de spawn (à coder dans ta scène)
    this.scene.spawnZombie(zombieType);
    this.spawned++;
  }
}

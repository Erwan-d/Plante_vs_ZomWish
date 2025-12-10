export default class ZombieWaveManager {
  constructor(scene, waves) {
    this.scene = scene;
    this.waves = waves;
    this.currentWaveIndex = 0;
    this.spawned = 0;
    this.waveInProgress = false;
    this.currentOnScreen = 0; 
    this.MAX_ON_SCREEN = 15;   
  }

  
  onZombieRemoved() {
    this.currentOnScreen = Math.max(0, this.currentOnScreen - 1);
  }

  startWaves() {
    this.currentWaveIndex = 0;
    this.launchWave();
  }

  launchWave() {
    if (this.currentWaveIndex >= this.waves.length) return;

    const wave = this.waves[this.currentWaveIndex];
    this.spawned = 0;
    this.waveInProgress = true;

    this.scene.time.addEvent({
      delay: wave.interval,
      repeat: wave.count - 1,
      callback: () => this.spawnZombie(wave),
      callbackScope: this
    });

    this.spawnZombie(wave);

    setTimeout(() => {
      this.currentWaveIndex++;
      this.launchWave();
    }, wave.interval * wave.count + 2000);
  }

  spawnZombie(wave) {
    // Empêche le spawn si 8 zombie sur l'écran
    if (this.currentOnScreen >= this.MAX_ON_SCREEN) return;
    if (this.spawned >= wave.count) return;

    const zombieType =
      wave.types[Math.floor(Math.random() * wave.types.length)];

    this.scene.spawnZombie(zombieType);
    this.spawned++;
    this.currentOnScreen++;
  }
}


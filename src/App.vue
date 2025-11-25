<template>
  <div id="toolbar">
    <h2>Plantes :</h2>

    <div
      class="plant"
      v-for="plant in plants"
      :key="plant.id"
      draggable="true"
      @dragstart="startDrag(plant, $event)"
    >
      {{ plant.emoji }} {{ plant.name }}
    </div>
  </div>

  <!-- Composant du jeu -->
  <Game />
</template>

<script>
import Game from "./components/Game.vue";

export default {
  components: { Game },

  data() {
    return {
      plants: [
        { id: "tournesol", emoji: "🌻", name: "Tournesol" },
        { id: "pisto-pois", emoji: "🌱", name: "Pistopoix" }
      ],
      draggingPlant: null
    };
  },

  methods: {
    startDrag(plant, event) {
      this.draggingPlant = plant;
      event.dataTransfer.setData("plant", plant.id);
    }
  }
};
</script>

<style>
#toolbar {
  background: #333;
  padding: 20px;
  display: flex;
  gap: 20px;
  color: white;
  font-size: 20px;
}

.plant {
  background: #444;
  padding: 10px;
  border-radius: 10px;
  cursor: grab;
}
</style>


// src/ui/PlantBar.js
import { Pistopoix, Tournesol } from "../../assets/plantes/index.js"

export default {
  name: "PlantBar",
  data() {
    return {
      plants: [
        {
          key: "tournesol",
          name: "Tournesol",
          icon: "src/assets/plantes/tournesol/icon.png",
          sprite: "src/assets/plantes/tournesol/tournesol.png",
          cost: 50,
          classRef: Tournesol  
        },
        {
          key: "pistopoix",
          name: "Pisto-pois",
          icon: "src/assets/plantes/pistopoix/icon.png",
          sprite: "src/assets/plantes/pistopoix/pistopoix.png",
          cost: 100,
          classRef: Pistopoix  
        }
      ]
    };
  },
  methods: {
    selectPlant(plant) {
      this.$root.selectedPlant = plant.key;
    },
    onDragStart(evt, plant) {
      evt.dataTransfer.effectAllowed = "copy";
      evt.dataTransfer.setData("plantKey", plant.key);
    }
  },
  template: `
    <div class="plant-bar">
      <div
        v-for="plant in plants"
        :key="plant.key"
        class="plant-card"
        draggable="true"
        @dragstart="onDragStart($event, plant)"
        @click="selectPlant(plant)"
      >
        <img :src="plant.icon" :alt="plant.name" />
        <div class="name">{{ plant.name }}</div>
        <div class="cost">{{ plant.cost }}</div>
      </div>
    </div>
  `
};


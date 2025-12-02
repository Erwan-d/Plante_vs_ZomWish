<template>
  <!-- Barre d’outils vide ou personnalisable -->
  <div id="toolbar">
    <h2>Menu de jeu</h2>
    <!-- Enrichis ici avec boutons si besoin -->
  </div>
  <!-- Composant du jeu -->
  <Game />
</template>

<script>
import Game from "./components/Game.vue";

export default {
  components: { Game },
  data() { return {}; }, // Plus de liste de plantes/test
  methods: {}
};
</script>

<style>
#toolbar {
  background: #333;
  padding: 20px;
  color: white;
  font-size: 20px;
}
</style>






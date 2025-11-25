// Récupère toutes les tuiles de niveaux
const levels = document.querySelectorAll(".level");

// Ajoute un clic sur chaque niveau
levels.forEach(lvl => {
    lvl.addEventListener("click", () => {

        const numLevel = lvl.dataset.level; // Niveau choisi

        // Sauvegarde dans localStorage (lu par game.js)
        localStorage.setItem("selectedLevel", numLevel);

        // Redirection vers le jeu
        window.location.href = "game.html";
    });
});


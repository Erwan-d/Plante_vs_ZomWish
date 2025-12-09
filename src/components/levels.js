const levels = document.querySelectorAll(".level");


levels.forEach(lvl => {
    lvl.addEventListener("click", () => {

        const numLevel = lvl.dataset.level; 

        
        localStorage.setItem("selectedLevel", numLevel);

    
        window.location.href = "game.html";
    });
});


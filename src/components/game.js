tryPlacePlant(clone, dropZone) {

    for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
            const cell = this.grid[r][c];

            if (cell.rect === dropZone) {

                // Case déjà occupée
                if (cell.plant) {
                    clone.x = clone.startX;
                    clone.y = clone.startY;
                    return;
                }

                // On centre
                clone.x = cell.rect.x;
                clone.y = cell.rect.y;

                this.input.setDraggable(clone, false);
                cell.plant = clone;

                // Début production des tournesols
                if (clone.plantType === "tournesol") {
                    this.startSunProduction(clone);
                }

                return;
            }
        }
    }
}


const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

// Canvas Width: 41 tiles * 16px. Canvas Height: 21 tiles * 16px.
canvas.width = 41 * 16;
canvas.height = 21 * 16;


c.fillStyle = 'black';
c.fillRect(0, 0, canvas.width, canvas.height);


const placementTilesData2D = [];
// Take the first 41 rows of the placementTilesData array and push them into the placementTilesData2D array.
for (let i = 0; i < placementTilesData.length; i += 41) {
    placementTilesData2D.push(placementTilesData.slice(i, i + 41));
}


const placementTiles = [];
// Loop through the placementTilesData2D array and add the building placement tiles to the canvas.
placementTilesData2D.forEach((row, yIndex) => {
    row.forEach((symbol, xIndex) => {
        if (symbol === 227) {
            // Add building placement tile.
            placementTiles.push(
                new PlacementTile({
                    position: {
                        // Multiply the x and y index by 16 to get the pixel position of the tile.
                        x: xIndex * 16,
                        y: yIndex * 16
                    }
                })
            );
        }
    })
})


const image = new Image();
image.onload = () => {
    animate();
};
image.src = 'img/gameMapSingle.png';


// Spawn enemies.
const enemies = [];
function spawnEnemies(spawnCount) {
    for (let i = 1; i < spawnCount + 1; i++) {

        const xOffset = i * 50;
        enemies.push(
            new Enemy({
                position: {x: waypoints[0].x + xOffset, y: waypoints[0].y}
            })
        );
    }
}


const buildings = [];
let activeTile = undefined;
let enemyCount = 3
spawnEnemies(enemyCount);


// Function to animate the canvas.
function animate() {
    requestAnimationFrame(animate);
    
    c.drawImage(image, 0, 0);
    for(let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        enemy.update();
    }

    placementTiles.forEach(tile => {
        tile.update(mouse);
    });

    buildings.forEach(building => {
        building.update();
        // Check if an enemy within building's range.
        building.target = null;
        const validEnemies = enemies.filter(enemy => {
            const xDiff = enemy.center.x - building.center.x;
            const yDiff = enemy.center.y - building.center.y;
            const distance = Math.hypot(xDiff, yDiff);
            return distance < building.range + enemy.radius;
        });
        building.target = validEnemies[0];

        // If there are valid enemies, set the building's target to the first valid enemy.
        for(let i = building.projectiles.length - 1; i >= 0; i--) {
            const projectile = building.projectiles[i];

            projectile.update();

            const xDiff = projectile.enemy.center.x - projectile.position.x;
            const yDiff = projectile.enemy.center.y - projectile.position.y;
            const distance = Math.hypot(xDiff, yDiff);

            // Projectile collisions with enemies.
            if (distance < projectile.enemy.radius + projectile.radius) {
                
                // Enemy health and projectile damage.
                projectile.enemy.health -= 20;
                if (projectile.enemy.health <= 0) {
                    const enemyIndex = enemies.findIndex((enemy) => {
                        return enemy === projectile.enemy;
                    });

                    if (enemyIndex > -1) enemies.splice(enemyIndex, 1);
                }

                // Tracking total number of enemies.
                if (enemies.length === 0) {
                    enemyCount += 2;
                    spawnEnemies(enemyCount);
                }

                building.projectiles.splice(i, 1);
            }
        }
    });
}


const mouse = {
    x: undefined,
    y: undefined
}



canvas.addEventListener('click', (event) => {
    // Check if the active tile is a building placement tile.
    if (activeTile && activeTile.occupied === false) {
        buildings.push(
            new Building({
                position: {
                    x: activeTile.position.x,
                    y: activeTile.position.y
                }
            })
        );
        activeTile.occupied = true;
    }
});


// Get the mouse position.
window.addEventListener('mousemove', (event) => {

    var rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;

    // Check for collision between the mouse and the placement tile.
    activeTile = null;
    for (let i = 0; i < placementTiles.length; i++) {
        const tile = placementTiles[i];
        if (
            mouse.x >= tile.position.x && 
            mouse.x < tile.position.x + tile.size &&
            mouse.y >= tile.position.y && 
            mouse.y < tile.position.y + tile.size 
        ) {
            activeTile = tile;
            break;
        }
    }
});



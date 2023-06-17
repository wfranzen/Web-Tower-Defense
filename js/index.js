const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
OverrideCanvas(canvas.constructor, c.constructor);

// Canvas Width: 41 tiles * TILESIZE (16) px. Canvas Height: 21 tiles * TILESIZE (16) px.
canvas.width = 41 * TILESIZE;
canvas.height = 41 * TILESIZE;

c.fillStyle = 'black';
c.fillRect(0, 0, canvas.width, canvas.height);

const mouse = {
    x: undefined,
    y: undefined
}

var mouseGridX = 0;
var mouseGridY = 0;

const image = new Image();
image.src = 'img/soloLane.png';


// Spawn enemies.
const enemies = [];
function spawnEnemies(spawnCount) {
    for (let i = 0; i < spawnCount; i++) {

        var newEnemy = new Enemy({location: {x: enemySpawnNode.x, y: enemySpawnNode.y}});
        const enemyPath = [...validPath];
        newEnemy.setPath(enemyPath);
        enemies.push(newEnemy);
        
    }
}


// Function to animate the canvas.
function animate() {

    c.drawImage(image, 0, 0);
    
    for(let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        enemy.update();
    }

    buildings.forEach(building => {

        building.update();
        // Check if an enemy within building's range.
        building.target = null;
        const validEnemies = enemies.filter(enemy => {
            const xDiff = enemy.position.x - building.drawCenter.x;
            const yDiff = enemy.position.y - building.drawCenter.y;
            const distance = Math.hypot(xDiff, yDiff);
            return distance < building.range + enemy.radius;
        });
        building.target = validEnemies[0];

        // If there are valid enemies, set the building's target to the first valid enemy.
        for(let i = building.projectiles.length - 1; i >= 0; i--) {
            const projectile = building.projectiles[i];

            projectile.update();

            const xDiff = projectile.enemy.position.x - projectile.position.x;
            const yDiff = projectile.enemy.position.y - projectile.position.y;
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
                    enemyCount += 1;
                    spawnEnemies(enemyCount);
                }

                building.projectiles.splice(i, 1);
            }
        }
    });


    drawPathLine(validPath, makeColorRGBA(255,0,0,0.5), c);

    if (mouseNode) {
        drawPoints([mouseNode], canPlaceTowerAtMouse ? makeColorRGBA(0,125,255,0.5) : makeColorRGBA(255,100,0,0.5), c);
    }
}

canvas.addEventListener('click', (event) => {
    
    if(!spawnTower(mouseGridX, mouseGridY)) {
        return;
    }

    // If a tower is spawned, update path for each enemy using their current position.
    updateEnemyPath();

});

function updateEnemyPath() {

    enemies.forEach(enemy => {
        
        const enemyCurrentNodeX = Math.floor(enemy.position.x / TILESIZE - 0.5);
        const enemyCurrentNodeY = Math.floor(enemy.position.y / TILESIZE - 0.5);
        const enemyCurrentNode = nodeMatrix[enemyCurrentNodeX][enemyCurrentNodeY];
        console.log(enemyCurrentNode);
        enemyCurrentNode.previous = null;
        

        // Calculate the path without modifying the original validPath array
        const enemyPath = astar(enemyCurrentNode, enemyGoalNode); // Compute the new path using the astar function (or your chosen pathfinding algorithm)
        //console.log(enemyPath);
        enemy.setPath(enemyPath); // Set the new path for the enemy
        
    });

}


// Get the mouse position.
var canPlaceTowerAtMouse = false;
var mouseNode = null;
window.addEventListener('mousemove', (event) => {

    var rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
    mouseGridX = Math.floor(mouse.x/TILESIZE);
    mouseGridY = Math.floor(mouse.y/TILESIZE);
    mouseGridX = Math.min(mouseGridX, 40);
    mouseGridY = Math.min(mouseGridY, 40);
    mouseGridX = Math.max(mouseGridX, 0);
    mouseGridY = Math.max(mouseGridY, 0);

    mouseNode = nodeMatrix[mouseGridX][mouseGridY];
    canPlaceTowerAtMouse = isValidTowerPlacement(mouseGridX, mouseGridY);
    
});


const validTilesMatrix = arrayToMatrix(placementTilesData, 41);

const nodeMatrix = buildNodeMatrix(validTilesMatrix);
linkNeighbors(nodeMatrix);

const enemySpawnNode = nodeMatrix[20][3];
const enemyGoalNode = nodeMatrix[20][37];
var validPath = astar(enemySpawnNode, enemyGoalNode);

const buildings = [];
let enemyCount = 1;
spawnEnemies(enemyCount);


setInterval(function(){
    animate();
}, 1000/120);
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
OverrideCanvas(canvas.constructor, c.constructor);

const towerPlacementMenu = document.getElementById('tower-placement-menu');
let selectedTile = { x: null, y: null };

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

const player_health_max = 500;
var player_health = 500;
var gameOverCheck = false;
let playerCurrency = 500;



// ============== Building Placement & Game Animation ============== //

// Function to animate the canvas.
function animate() {

    // Draw the canvas, health bar, and currency.
    c.drawImage(image, 0, 0);
    renderPlayerHealthBar();
    renderPlayerCurrency();
    
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
            return distance < building.attackRange + enemy.radius;
        });
        building.target = validEnemies[0];

        // If there are valid enemies, set the building's target to the first valid enemy.
        for(let i = building.projectiles.length - 1; i >= 0; i--) {
            const projectile = building.projectiles[i];
            projectile.damage = building.attackDamage;

            projectile.update();

            const xDiff = projectile.enemy.position.x - projectile.position.x;
            const yDiff = projectile.enemy.position.y - projectile.position.y;
            const distance = Math.hypot(xDiff, yDiff);

            // Projectile collisions with enemies.
            if (distance < projectile.enemy.radius + projectile.radius) {
                

                if(projectile.enemy.isAlive == true) {
                    enemyAttacked(projectile.enemy, projectile.damage);
                } else {

                    const enemyIndex = enemies.findIndex((enemy) => {
                        return enemy === projectile.enemy;
                    });

                    // Remove enemy from enemies array.
                    if (enemyIndex > -1) enemies.splice(enemyIndex, 1);
                }

                building.projectiles.splice(i, 1);
            }
        }

        
    });

    drawPathLine(validCheckpointPath, makeColorRGBA(255,0,0,0.5), c);

    if (mouseNode) {
        drawPoints([mouseNode], canPlaceTowerAtMouse ? makeColorRGBA(0,125,255,0.5) : makeColorRGBA(255,100,0,0.5), c);
    }

    if(player_health === 0) {
        console.log('Game Over!');
        drawGameOverMessage();
        gameOver();
    }
}




// ============== Mouse Functionality ============== //

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

// Enemy path updating after building placement.
function updateEnemyPath() {

    enemies.forEach(enemy => {
        
        const enemyCurrentNodeX = Math.floor(enemy.position.x / TILESIZE - 0.5);
        const enemyCurrentNodeY = Math.floor(enemy.position.y / TILESIZE - 0.5);
        const enemyCurrentNode = nodeMatrix[enemyCurrentNodeX][enemyCurrentNodeY];
        enemyCurrentNode.previous = null;
        
        // Calculate the path without modifying the original validPath array
        const enemyPath = astar(enemyCurrentNode, enemy.currentGoal); // Compute the new path using the astar function (or your chosen pathfinding algorithm)
        enemy.setPath(enemyPath); // Set the new path for the enemy
        
    });

}


// ============== Tower Placement Menu ============== //

// Display tower placement menu on valid click.
canvas.addEventListener('click', (event) => {
    
    const canvasRect = canvas.getBoundingClientRect();
    if(canPlaceTowerAtMouse) {
        towerPlacementMenu.style.left = (event.clientX) + 'px';
        towerPlacementMenu.style.top = (event.clientY) + 'px'
        towerPlacementMenu.classList.add('visible');
        selectedTile = {x: mouseGridX, y: mouseGridY};  // Save the selected tile for tower placement - used in buildTower()
    }

});

// Hide tower placement menu on click outside menu.
window.addEventListener('click', (event) => {
    

    if(event.target !== towerPlacementMenu && towerPlacementMenu.contains(event.target)) {
        towerPlacementMenu.classList.remove('visible');
    }
});

for (let towerType in towerTypes) {

    let towerData = towerTypes[towerType];
    let towerInstance = new towerData.class({});
    let towerOption = document.createElement('div');

    towerOption.className = 'tower-type';
    towerOption.textContent = towerData.name + " (" + towerInstance.towerCost + " gold)";
    
    towerOption.style.background = towerInstance.buildingColor;
    
    towerOption.addEventListener('click', () => {
        buildTower(towerType);
    });
    
    towerPlacementMenu.appendChild(towerOption);
}



// ============== Build Tower ============== //

function buildTower(towerType) {

    // Create a new tower instance.
    if(!spawnTower(towerType, selectedTile)) {
        return;
    }

    // If a tower is spawned, update path for each enemy using their current position.
    updateEnemyPath();
}



// ============== Game Initialization ============== //
const validTilesMatrix = arrayToMatrix(placementTilesData, 41);

const nodeMatrix = buildNodeMatrix(validTilesMatrix);
linkNeighbors(nodeMatrix);

const enemySpawnNode = nodeMatrix[20][0];  // Enemy spawn
const enemyCheckpointNode = nodeMatrix[20][20];  // Enemy checkpoint
const enemyGoalNode = nodeMatrix[20][40];  // Enemy goal

var validCheckpointPath = astar(enemySpawnNode, enemyCheckpointNode);
var validGoalPath = astar(enemyCheckpointNode, enemyGoalNode);

const buildings = [];

setTimeout(() => {
    startWave();
}, FIRST_WAVE_DELAY_MS)

setInterval(function(){
    animate();
}, 1000/120);

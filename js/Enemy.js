// Object class to represent an enemy.
class Enemy {

    // Constructor for the basic enemy object.
    constructor({ location = {x: 0, y: 0} }) {
    
        this.location = location;
        this.position = {
            x: (0.5 + this.location.x) * TILESIZE,
            y: (0.5 + this.location.y) * TILESIZE
        }
        this.radius = 12;
        this.health = 100;
        this.velocity = {
            x: 0,
            y: 0
        }
        this.remainingWaypoints = null;
        this.nextWaypoint = null;``
        this.currentGoal = enemyCheckpointNode;
        this.currencyValue = 5;
        this.isAlive = true;
        this.type = 'Basic';
        this.speed = 1;
        this.enemyColor = 'red';
    }

    // Draws the enemy.
    draw() {
        c.fillStyle = this.enemyColor;
        // c.fillRect(this.position.x, this.position.y, this.width, this.height);
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fill();


        // ====== Temporarily disabled ======
        // Draw the enemy's health bar.   
        // c.fillStyle = 'red';
        // c.fillRect(this.position.x - this.radius, this.position.y - this.radius * 1.5, 15, 4);
        // c.fillStyle = 'green';
        // c.fillRect(this.position.x - this.radius, this.position.y - this.radius * 1.5, 15 * (this.health / 100), 4);
    }

    
    // Update the enemy's position.
    update() {

        this.draw();
        
        if(!this.nextWaypoint) {
            return false;
        }

        // Get the next waypoint and enemy's travel path.
        const waypointX = (0.5 + this.nextWaypoint.x) * TILESIZE;
        const waypointY = (0.5 + this.nextWaypoint.y) * TILESIZE;
        const yDistance = waypointY - this.position.y;
        const xDistance = waypointX - this.position.x;
        const angle = Math.atan2(yDistance, xDistance);

        // Update the enemy's movement speed.
        this.velocity.x = Math.cos(angle) * this.speed;
        this.velocity.y = Math.sin(angle) * this.speed;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (
            Math.abs(Math.round(this.position.x) - Math.round(waypointX)) < Math.abs(this.velocity.x) && 
            Math.abs(Math.round(this.position.y) - Math.round(waypointY)) < Math.abs(this.velocity.y)
        ) {
            this.remainingWaypoints.shift();
            this.nextWaypoint = this.remainingWaypoints[0];
            
            if(this.currentGoal == enemyCheckpointNode && this.remainingWaypoints[0] == null) {  // If checkpoint position reached by enemy
                this.currentGoal = enemyGoalNode;
                updateEnemyPath();
                
            } else if(!this.nextWaypoint) {
                console.log('End of path reached.');
                player_health -= 50;
                this.isAlive = false;
            }
        }
    }

    // Set the enemy's path.
    setPath(path) {
        this.remainingWaypoints = path;
        this.remainingWaypoints.shift();
        this.nextWaypoint = this.remainingWaypoints[0];
    }
}

// ============== Enemy Types ============== //

// Fast enemy type.
class FastEnemy extends Enemy {
    constructor(options) {
        super(options);
        this.type = 'Fast';
        this.speed = 1.5;
        this.health = 50;
        this.currencyValue = 10;
        this.enemyColor = 'yellow';
    }
}

// Tank enemy type.
class TankEnemy extends Enemy {
    constructor(options) {
        super(options);
        this.type = 'Tank';
        this.health = 500;
        this.currencyValue = 20;
        this.speed = 0.75;
        this.enemyColor = 'green';
    }
}

// Boss enemy type.
class BossEnemy extends Enemy {
    constructor(options) {
        super(options);
        this.type = 'Boss';
        this.health = 2500;
        this.currencyValue = 100;
        this.speed = 0.5;
        this.enemyColor = 'purple';
    }
}

// Enemy types object.
let enemyTypes = {
    Enemy: Enemy,
    FastEnemy: FastEnemy,
    TankEnemy: TankEnemy,
    BossEnemy: BossEnemy
}



// ============== Enemy Spawning ============== //

// Enemy spawning variables.
const enemies = [];
let wave = 1;
let spawnIndex = 0;
let spawnInterval = null;
let timeBetweenSpawn = 1000; // Interval between enemy spawns in milliseconds
let timeBetweenWave = 10000; // Interval between waves in milliseconds

// Enemy spawning functions.
function spawnEnemy() {

    if (spawnIndex < waves[wave].length) {
        const enemyType = waves[wave][spawnIndex];  // Grab enemy in the current wave from the pre-determined waves array.
        const EnemyClass = enemyTypes[enemyType];  // Grab the relevant enemy class from the enemyTypes object.
        const newEnemy = new EnemyClass({ location: enemySpawnNode });  // Create a new enemy object.
        const enemyPath = [...validCheckpointPath];
        newEnemy.health += wave * 10; // Temporary difficulty mechanic
        newEnemy.setPath(enemyPath);
        console.log(newEnemy.type + ' enemy spawned!');
        enemies.push(newEnemy);
        spawnIndex++;
    } else {
        clearInterval(spawnInterval); // Stop spawning enemies at the end of the wave
    }
}
  
function startWave() {
    spawnIndex = 0;
    spawnInterval = setInterval(spawnEnemy, timeBetweenSpawn);

    // After spawning all enemies in the wave, start the next wave after a delay
    setTimeout(() => {

        if(gameOverCheck) return;
        reduceSpawnInterval();
        displayWaveNumber(wave);

        clearInterval(spawnInterval);
        wave++;
        startWave();
        console.log(`Wave ${wave} started!`);
    }, timeBetweenSpawn * waves[wave].length + timeBetweenWave);
}

function reduceSpawnInterval() {

    if(timeBetweenSpawn > 250) {
        timeBetweenSpawn -= 50;
    }
}


// ============== Enemy Health ============== //

// Create a function that receives an enemy and reduce its health by 20.
function enemyAttacked(enemy) {

    if(!enemy.isAlive) return;

    if(enemy.health > 0) {
        enemy.health -= 20;  // Temporary damage mechanic. Needs to be changed to account for different towers.
    } else {
        enemyKilled(enemy);
    }
}

// Enemy no longer isAlive and add currency value to player's total.
function enemyKilled(enemy) {

    enemy.isAlive = false;
    playerCurrency += enemy.currencyValue;
}



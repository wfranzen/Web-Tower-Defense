// Object class to represent the enemy.
class Enemy {

    // Constructor for the enemy object.
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
        this.nextWaypoint = null;
        this.currentGoal = enemyCheckpointNode;
    }

    // Draws the enemy.
    draw() {
        c.fillStyle = 'red';
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
        const speed = 1;
        this.velocity.x = Math.cos(angle) * speed;
        this.velocity.y = Math.sin(angle) * speed;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (
            Math.abs(Math.round(this.position.x) - Math.round(waypointX)) < Math.abs(this.velocity.x) && 
            Math.abs(Math.round(this.position.y) - Math.round(waypointY)) < Math.abs(this.velocity.y)
        ) {
            this.remainingWaypoints.shift();
            this.nextWaypoint = this.remainingWaypoints[0];
            
            if(this.position.x == 328 && this.position.y == 328) {
                this.currentGoal = enemyGoalNode;
                updateEnemyPath();
                
            } else if(!this.nextWaypoint) {
                console.log('End of path reached.');
                player_health -= 50;
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
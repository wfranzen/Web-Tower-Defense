// Object class to represent the placement tiles.
class PlacementTile {
    constructor({ position = {x: 0, y: 0}}) {
        this.position = position;
        this.size = 16;  // 16px x 16px.
        this.color = 'rgba(0, 0, 255, 0.1)';
        this.occupied = false;
    }

    draw() {
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.size, this.size);
    }

    update(mouse) {
        this.draw();

        // Check for collision between the mouse and the placement tile.
        if (
            mouse.x >= this.position.x && 
            mouse.x < this.position.x + this.size &&
            mouse.y >= this.position.y && 
            mouse.y < this.position.y + this.size
        ) {
            this.color = 'rgba(0, 0, 255, 0.5)';
        } else {
            this.color = 'rgba(0, 0, 255, 0.1)'
        }
    }
}


// Object class to represent the enemy.
class Enemy {

    // Constructor for the enemy object.
    constructor({ position = {x: 0, y: 0} }) {
        this.position = position;
        this.width = 24;
        this.height = 24;
        this.waypointIndex = 0;
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        }
        this.radius = 12;
        this.health = 100;
        this.velocity = {
            x: 0,
            y: 0
        }

        // Set the enemy's starting position using it's center rather than it's top left corner.
        this.position.x -= this.width / 2;
        this.position.y -= this.height / 2;
    }

    // Draws the enemy.
    draw() {
        c.fillStyle = 'red';
        // c.fillRect(this.position.x, this.position.y, this.width, this.height);
        c.beginPath();
        c.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
        c.fill();

        // Draw the enemy's health bar.
        c.fillStyle = 'red';
        c.fillRect(this.position.x, this.position.y - 10, this.width, 4);
        c.fillStyle = 'green';
        c.fillRect(this.position.x, this.position.y - 10, this.width * (this.health / 100), 4);
    }

    // Update the enemy's position.
    update() {
        this.draw();

        // Get the next waypoint and enemy's travel path.
        const waypoint = waypoints[this.waypointIndex];
        const yDistance = waypoint.y - this.center.y;
        const xDistance = waypoint.x - this.center.x;
        const angle = Math.atan2(yDistance, xDistance);

        // Update the enemy's movement speed.
        const speed = 3;
        this.velocity.x = Math.cos(angle) * speed;
        this.velocity.y = Math.sin(angle) * speed;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        }

        if (
            Math.abs(Math.round(this.center.x) - Math.round(waypoint.x)) < Math.abs(this.velocity.x) && 
            Math.abs(Math.round(this.center.y) - Math.round(waypoint.y)) < Math.abs(this.velocity.y) &&
            this.waypointIndex < waypoints.length - 1
        ) {
            this.waypointIndex++;
        }
    }
}


// Object class to represent projectiles.
class Projectile {
    constructor({ position = {x: 0, y: 0}, enemy }) {
        this.position = position;
        this.velocity = {
            x: 0,
            y: 0
        };
        this.radius = 4;
        this.enemy = enemy;
    }

    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = 'orange';
        c.fill();
    }

    // Update the projectile's position to move towards the targeted enemy.
    update() {
        this.draw();

        const angle = Math.atan2(
            this.enemy.center.y - this.position.y,
            this.enemy.center.x - this.position.x
        );

        const power = 2;  // Speed of the projectile.
        this.velocity.x = Math.cos(angle) * power;
        this.velocity.y = Math.sin(angle) * power;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}


// Object class to represent buildings.
class Building {
    constructor({ position = {x: 0, y: 0} }) {
        this.position = position;
        this.size = 16;  // 16px x 16px.
        this.center = {
            x: this.position.x + this.size / 2,
            y: this.position.y + this.size / 2
        }
        this.projectiles = [];
        this.range = 64;
        this.target;
        this.frames = 0;
    }

    draw() {
        c.fillStyle = 'green';
        c.fillRect(this.position.x, this.position.y, this.size, this.size);

        c.beginPath();
        c.arc(this.center.x, this.center.y, this.range, 0, Math.PI * 2);
        c.fillStyle = 'rgba(0, 255, 0, 0.2)';
        c.fill();
    }

    update() {
        this.draw();
        if (this.frames % 100 === 0 && this.target) {
            this.projectiles.push(
                new Projectile({
                    position: {
                        x: this.center.x,
                        y: this.center.y
                    },
                    enemy: this.target
                })
            );
        }

        this.frames++;
    }
}



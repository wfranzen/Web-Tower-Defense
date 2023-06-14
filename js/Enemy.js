// Object class to represent the enemy.
class Enemy {

    // Constructor for the enemy object.
    constructor({ location = {x: 0, y: 0} }) {
    
        this.location = location;
        this.position = {
            x: this.location.x * TILESIZE,
            y: this.location.y * TILESIZE
        }
        this.width = 24;
        this.height = 24;
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
        this.waypointIndex = 0;

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
    }
}
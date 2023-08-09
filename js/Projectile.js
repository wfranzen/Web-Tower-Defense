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
        this.projSpeed = 2;
        this.damage = 20;
    }

    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = 'black';
        c.fill();
    }

    // Update the projectile's position to move towards the targeted enemy.
    update() {
        this.draw();

        const angle = Math.atan2(
            this.enemy.position.y - this.position.y,
            this.enemy.position.x - this.position.x
        );

        this.velocity.x = Math.cos(angle) * this.projSpeed;
        this.velocity.y = Math.sin(angle) * this.projSpeed;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}
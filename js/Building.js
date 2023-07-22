// Object class to represent buildings.
class Building {
    constructor({ location = {x: 0, y: 0} }) {
        this.location = location;
        this.size = 16;  // 16px x 16px.
        this.drawLocation = {
            x: this.location.x * this.size,
            y: this.location.y * this.size
        }
        this.drawCenter = {
            x: this.drawLocation.x + this.size / 2,
            y: this.drawLocation.y + this.size / 2
        }
        this.projectiles = [];
        this.attackRange = 64;
        this.target;
        this.frames = 0;
        this.attackDamage = 20;
        this.buildingColor = 'green';
    }

    draw() {
        c.fillStyle = this.buildingColor;
        c.fillRect(this.drawLocation.x, this.drawLocation.y, this.size, this.size);
        

        // Draw the building's attackRange. Use setStroke in future.
        // c.beginPath();
        // c.arc(this.center.x, this.center.y, this.attackRange, 0, Math.PI * 2);
        // c.fillStyle = 'rgba(0, 255, 0, 0.2)';
        // c.fill();
    }

    update() {
        this.draw();
        if (this.frames % 100 === 0 && this.target) {
            this.projectiles.push(
                new Projectile({
                    position: {
                        x: this.drawCenter.x,
                        y: this.drawCenter.y
                    },
                    enemy: this.target
                })
            );
        }

        this.frames++;
    }
}

// ============== Tower Types ============== //

// A fast firing tower with shorter range and lower damage.
class QuickTower extends Building {
    constructor({ location = {x: 0, y: 0} }) {
        super({ location });
        this.attackRange = 48;
        this.projectileSpeed = 3;
        this.frames = 0;
        this.attackDamage = 15;
        this.buildingColor = 'orange';
    }

    update() {
        this.draw();
        if (this.frames % 50 === 0 && this.target) {
            this.projectiles.push(
                new Projectile({
                    position: {
                        x: this.drawCenter.x,
                        y: this.drawCenter.y
                    },
                    enemy: this.target
                })
            );
        }

        this.frames++;
    }
}
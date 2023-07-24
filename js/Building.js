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
        this.attackSpeed = 100;  // Number of frames between attacks. Lower = Faster.
        this.towerCost = 50;
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
        if (this.frames % this.attackSpeed === 0 && this.target) {
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

// A quick firing tower with shorter range and lower damage.
// Stats: COST(60) - AS(50) - DMG(15) - RANGE(48) - PROJSPD(3)
class QuickTower extends Building {
    constructor(stats) {
        super(stats);
        this.attackRange = 48;
        this.projectileSpeed = 2;
        this.attackDamage = 15;
        this.buildingColor = 'orange';
        this.attackSpeed = 50;
        this.towerCost = 50;
    }
}

// A slow firing tower with longer range and higher damage.
// Stats: COST(75) - AS(300) - DMG(50) - RANGE(100) - PROJSPD(3)
class SniperTower extends Building {
    constructor(stats) {
        super(stats);
        this.attackRange = 96;
        this.projectileSpeed = 3;
        this.attackDamage = 30;
        this.buildingColor = 'purple';
        this.attackSpeed = 150;
        this.towerCost = 70;
    }
}

// Enemy types object.
let towerTypes = {
    Building: Building,
    SniperTower: SniperTower,
    QuickTower: QuickTower
}
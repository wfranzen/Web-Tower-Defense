// Pre-determined waves of enemies.
let waves = [[], // Wave 0 Does Not Exist.

    // Note that wave number here is 1 less than the actual wave variable.
    ["Enemy", "Enemy", "Enemy"], // Wave 1
    ["Enemy", "Enemy", "Enemy", "Enemy", "Enemy"], // Wave 2
    ["Enemy", "Enemy", "Enemy", "Enemy", "Enemy", "Enemy", "Enemy"], // Wave 3
    ["Enemy", "Enemy", "Enemy", "Enemy", "FastEnemy"], // Wave 3
    ["FastEnemy", "FastEnemy", "Enemy", "Enemy", "Enemy"], // Wave 2
    ["Enemy", "Enemy", "FastEnemy", "FastEnemy", "FastEnemy"], // Wave 4
    ["TankEnemy", "Enemy", "Enemy", "Enemy", "Enemy"], // Wave 5
    ["Enemy", "Enemy", "Enemy", "Enemy", "Enemy", "Enemy", "Enemy", "Enemy"], // Wave 6
    ["TankEnemy", "Enemy", "Enemy", "Enemy", "TankEnemy", "Enemy", "Enemy", "Enemy"], // Wave 7
    ["TankEnemy", "Enemy", "Enemy", "Enemy", "TankEnemy", "Enemy", "Enemy", "Enemy"], // Wave 8
    ["FastEnemy", "FastEnemy", "FastEnemy", "FastEnemy", "FastEnemy", "FastEnemy"], // Wave 9
    ["BossEnemy"], // Wave 10
    ["TankEnemy", "FastEnemy", "FastEnemy", "TankEnemy", "FastEnemy", "FastEnemy"], // Wave 11
    ["TankEnemy", "TankEnemy", "Enemy", "Enemy", "Enemy", "TankEnemy", "TankEnemy", "Enemy", "Enemy", "Enemy"], // Wave 12
    ["Enemy", "Enemy", "Enemy", "FastEnemy", "Enemy", "Enemy", "Enemy", "FastEnemy", "Enemy", "Enemy", "Enemy", "FastEnemy"], // Wave 13
    ["FastEnemy", "Enemy", "Enemy", "FastEnemy", "FastEnemy", "Enemy", "Enemy", "FastEnemy", "FastEnemy", "Enemy", "Enemy", "FastEnemy"], // Wave 14
    ["TankEnemy", "FastEnemy", "FastEnemy", "TankEnemy", "FastEnemy", "FastEnemy", "TankEnemy", "FastEnemy", "FastEnemy"], // Wave 15
    ["TankEnemy", "TankEnemy", "TankEnemy", "Enemy", "Enemy", "Enemy", "Enemy", "Enemy", "Enemy", "Enemy", "Enemy", "Enemy", "Enemy"], // Wave 16
    ["TankEnemy", "FastEnemy", "FastEnemy", "Enemy", "Enemy", "Enemy", "TankEnemy", "FastEnemy", "FastEnemy", "Enemy", "Enemy", "Enemy"], // Wave 17
    ["Enemy", "Enemy", "Enemy", "Enemy", "Enemy", "Enemy", "Enemy", "Enemy", "Enemy", "Enemy", "Enemy", "Enemy", "Enemy", "Enemy", "Enemy", "Enemy", "Enemy", "Enemy", "Enemy", "Enemy", "Enemy", "Enemy", "Enemy", "Enemy", "Enemy", "Enemy"], // Wave 18
    ["FastEnemy", "FastEnemy", "FastEnemy", "FastEnemy", "FastEnemy", "TankEnemy", "FastEnemy", "FastEnemy", "FastEnemy", "FastEnemy", "FastEnemy", "TankEnemy"], // Wave 19
    ["BossEnemy", "BossEnemy", "BossEnemy"], // Wave 20


]
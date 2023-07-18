function arrayToMatrix(gridArray, columns) {
    const matrix = [];
    for (let i = 0; i < gridArray.length; i += columns) {
        matrix.push(gridArray.slice(i, i + columns));
    }

    let rotatedMatrix = rotateMatrix(matrix);
    return rotatedMatrix;
}

function isWall(symbol) {

    if (symbol === 0) {
        return true;
    }
    return false;
}

function isSpawn(symbol) {

    if (symbol === 1) {
        return true;
    }
    return false;
}

function buildNodeMatrix(gridMatrix) {

    const nodeMatrix = [];
    for (let x = 0; x < gridMatrix.length; x++) {

        const nodeRow = [];
        for(let y = 0; y < gridMatrix[x].length; y++) {
            
            var node = new Node(x, y);
            node.wall = isWall(gridMatrix[x][y]);
            node.spawn = isSpawn(gridMatrix[x][y]);
            nodeRow.push(node);
        }
        nodeMatrix.push(nodeRow);
    }
    return nodeMatrix;
}

function rotateMatrix(matrix) {

    // Switch the rows and columns.
    const rotatedMatrix = [];
    for (let col = 0; col < matrix[0].length; col++) {
        const rotatedRow = [];
        for (let row = 0; row < matrix.length; row++) {
            rotatedRow.push(matrix[row][col]);
        }
        rotatedMatrix.push(rotatedRow);
    }

    return rotatedMatrix;
}

function linkNeighbors(nodeMatrix) {

    for(let x = 0; x < nodeMatrix.length; x++) {
        for(let y = 0; y < nodeMatrix[x].length; y++) {
                
            var node = nodeMatrix[x][y];
            if (x > 0) {
                node.neighbors.push(nodeMatrix[x - 1][y]);
            }
            if (x < nodeMatrix.length - 1) {
                node.neighbors.push(nodeMatrix[x + 1][y]);
            }
            if (y > 0) {
                node.neighbors.push(nodeMatrix[x][y - 1]);
            }
            if (y < nodeMatrix[x].length - 1) {
                node.neighbors.push(nodeMatrix[x][y + 1]);
            }
        }
    }
}


// Check to see if the placement of a building does not make the path impossible.
function isValidTowerPlacement(xx, yy) {

    // Prevent building tower on walls and spawn.
    if(nodeMatrix[xx][yy].wall === true) {return false;}
    if(nodeMatrix[xx][yy].spawn === true) {return false;}

    // Prevent building tower on path - checks if placement of wall at (xx,yy) allows for possible path
    nodeMatrix[xx][yy].wall = true;
    validCheckpointPath = astar(enemySpawnNode, enemyCheckpointNode);
    validGoalPath = astar(enemyCheckpointNode, enemyGoalNode);
    isValidPath = validCheckpointPath.length > 0 && validGoalPath.length > 0;
    nodeMatrix[xx][yy].wall = false;


    if(!isValidPath) {
        validCheckpointPath = astar(enemySpawnNode, enemyCheckpointNode);
        validGoalPath = astar(enemyCheckpointNode, enemyGoalNode);
        return false;
    }

    // Allow placement of tower.
    return true;
}

// // Check to see if the placement of a building does not make the path impossible.
// function isValidGoalTowerPlacement(xx, yy) {

//     // Prevent building tower on walls and spawn.
//     if(nodeMatrix[xx][yy].wall === true) {return false;}
//     if(nodeMatrix[xx][yy].spawn === true) {return false;}

//     // Prevent building tower on path - checks if placement of wall at (xx,yy) allows for possible path
//     nodeMatrix[xx][yy].wall = true;
//     validCheckpointPath = astar(enemySpawnNode, enemyCheckpointNode);
//     // validGoalPath = astar(enemyCheckpointNode, enemyGoalNode);
//     isValidPath = validCheckpointPath.length > 0;
//     nodeMatrix[xx][yy].wall = false;


//     if(!isValidPath) {
//         validCheckpointPath = astar(enemySpawnNode, enemyCheckpointNode);
//         // validGoalPath = astar(enemyCheckpointNode, enemySpawnNode);
//         return false;
//     }

//     // Allow placement of tower.
//     return true;
// }


function spawnTower(xx, yy) {
    // Check if the active tile is a building placement tile.
    if (!isValidTowerPlacement(xx, yy)) {
        return false;
    }

    buildings.push(
        new Building({
            location: {
                x: xx,
                y: yy
            }
        })
    );
    
    nodeMatrix[xx][yy].wall = true;
    // validPath = astar(enemySpawnNode, enemyGoalNode);  // Recalculated higher up

    // Place the tower on the grid.
    return true;
}


function drawPoints(pointsArray, color, context) {

    
    for(let i = 0; i < pointsArray.length; i++) {
        context.fillStyle = color || 'blue';
        context.fillRect(pointsArray[i].x * TILESIZE, pointsArray[i].y * TILESIZE, TILESIZE, TILESIZE);
    }
}

function drawPathLine(pointsArray, color, context) {

    if(!pointsArray || pointsArray.length === 0) {return;}

    context.strokeStyle = color || 'blue';
    context.lineWidth = 1;
    context.moveTo(pointsArray[0].x * TILESIZE + TILESIZE / 2, pointsArray[0].y * TILESIZE + TILESIZE / 2);

    for(let i = 0; i < pointsArray.length; i++) {
        context.lineTo(pointsArray[i].x * TILESIZE + TILESIZE / 2, pointsArray[i].y * TILESIZE + TILESIZE / 2);
    }
    context.stroke();
}


function drawGridPoints(gridMatrix, entriesToDraw) {

    for(let i = 0; i < gridMatrix.length; i++) {
        for(let j = 0; j < gridMatrix[i].length; j++) {

            var tile = gridMatrix[i][j];
            var contains = entriesToDraw.includes(tile);
            if (contains) {
                c.strokeStyle = 'black';
                c.lineWidth = 0.1;
                c.strokeRect(j * TILESIZE, i * TILESIZE, TILESIZE, TILESIZE);

            }
        }
    }
}


function makeColorRGBA(rr,gg,bb,aa) {
    return 'rgba('	+Math.round(rr||0)+','
                                +Math.round(gg||0)+','
                                +Math.round(bb||0)+','
                                +(Math.round((aa*1000)||1000)/1000)+')';
}


function displayWaveNumber(waveNumber) {
    const waveNumberElement = document.getElementById('waveNumberElement');
    waveNumberElement.textContent = 'Wave ' + waveNumber;
    waveNumberElement.style.opacity = '1'; // Set initial opacity to fully visible

    // Fade out the wave number element after 3 seconds
    setTimeout(function () {
        waveNumberElement.style.opacity = '0'; // Set opacity to fade out gradually
    }, 3000); // Adjust the duration as needed
}



// Stop spawning enemies when player_health reaches 0.
function gameOver() {
    clearInterval(spawnInterval); // Stop spawning enemies
    drawGameOverMessage(); // Display the game over message
    //cancelAnimationFrame(animationFrame); // Stop the animation loop

    spawnInterval = null;
    gameOverCheck = true;

    canvas.removeEventListener('click', isValidTowerPlacement);
  }


function drawGameOverMessage() {
    const gameOverElement = document.getElementById('gameOverElement');
    gameOverElement.textContent = 'Game Over!';
    gameOverElement.style.opacity = '1'; // Set initial opacity to fully visible
}

function renderPlayerHealthBar() {
    const healthBarWidth = 200;
    const healthBarHeight = 20;
    const healthBarX = 10;
    const healthBarY = 10;
  
    // Calculate the current health bar width based on the player's health percentage
    const currentHealthWidth = (player_health / player_health_max) * healthBarWidth;
  
    // Draw the background health bar
    c.fillStyle = 'gray';
    c.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
  
    // Draw the current health bar
    c.fillStyle = 'green';
    c.fillRect(healthBarX, healthBarY, currentHealthWidth, healthBarHeight);
  }
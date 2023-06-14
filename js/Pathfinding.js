// Define a Node class to represent each cell in the grid
class Node {
    constructor(col, row) {
      this.row = row;
      this.col = col;
      this.g = 0; // Cost from the start node to this node
      this.h = 0; // Heuristic cost from this node to the goal node
      this.f = 0; // Total cost (g + h)
      this.neighbors = []; // Array to store neighboring nodes
      this.previous = null; // Reference to the previous node in the optimal path
      this.wall = false; // Flag indicating if this node is a wall or obstacle
    //   this.built = false; // Flag indicating if this node is a building
      this.x = col;
      this.y = row;
    }
}

// A* algorithm implementation
function astar(start, end) {
// Create open and closed lists
    let open = [];
    let closed = [];

    if(start.wall) return open;

    // Add the start node to the open list
    open.push(start);

    while (open.length > 0) {
        // Find the node with the lowest total cost (f) in the open list
        let currentNode = open[0];
        for (let i = 1; i < open.length; i++) {
            if (open[i].f < currentNode.f || (open[i].f === currentNode.f && open[i].h < currentNode.h)) {
                currentNode = open[i];
            }
        }

        // Move the current node from the open list to the closed list
        open = open.filter((node) => node !== currentNode);
        closed.push(currentNode);

        // Check if the goal node is reached
        if (currentNode === end) {
            return reconstructPath(currentNode);
        }

        // Get the neighbors of the current node
        let neighbors = currentNode.neighbors;

        for (let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i];

            // Skip the neighbor if it is already in the closed list or is a wall
            if (closed.includes(neighbor) || neighbor.wall) {
                continue;
            }

            // Calculate the new g cost for the neighbor
            let gScore = currentNode.g + 1;

            // Check if the neighbor is already in the open list
            let inOpenList = open.includes(neighbor);

            if (!inOpenList || gScore < neighbor.g) {
                // Update the neighbor's properties
                neighbor.g = gScore;
                neighbor.h = heuristic(neighbor, end);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.previous = currentNode;

                if (!inOpenList) {
                // Add the neighbor to the open list
                open.push(neighbor);
                }
            }
        }
    }

    // No path found
    return [];
}

// Heuristic function (Manhattan distance)
function heuristic(nodeA, nodeB) {
    return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}

// Function to reconstruct the path from the goal node to the start node
function reconstructPath(currentNode) {
    let path = [];
    while (currentNode) {
        path.push(currentNode);
        currentNode = currentNode.previous;
    }
    return path.reverse();
}

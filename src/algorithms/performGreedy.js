/**
 * Performs Greedy search algorithm to find the local optimal
 * move which may not be the global optimal
 * 
 * 
 * @param {Object[][]<Node>} grid The current grid state
 * @param {Object<Node>} startNode The grid's Start node
 * @param {Object<Node>} finishNode The grid's Finish node
 * @returns {Object[]<Node>} All visited nodes in order
 */
 export default function performGreedy(grid, startNode, finishNode) {
    const visitedNodes = [];
    const unvisitedNodes = getAllNodes(grid);

    startNode.heuristicDistance = getDistanceFromFinish(startNode, finishNode);

    while (unvisitedNodes.length != 0) {
        sortNodesByDistance(unvisitedNodes, finishNode);
        const closestNode = unvisitedNodes.shift();
        
        // if the closest node is a wall, skip visiting it
        if (closestNode.nodeType === "wall-node" || 
            closestNode.nodeType === "wall-node-maze") continue;

        // condition where no path is possible
        if (closestNode.heuristicDistance === Infinity) return visitedNodes;

        closestNode.isVisited = true;
        visitedNodes.push(closestNode);

        if (closestNode === finishNode) return visitedNodes;
        updateUnvisitedNeighbors(closestNode, finishNode, grid);
    }
    return visitedNodes;
}

/**
 * Returns all of the nodes in the grid
 * 
 * @param {Object[][]<Node>} grid The current grid state
 * @returns {Object[]<Node>} All nodes in the grid
 */
function getAllNodes(grid) {
    const allNodes = [];    
    for (const row of grid) {
        for (const node of row) {
            allNodes.push(node);
        }
    }
    return allNodes;
}

/**
 * Sorts the unvisited nodes in increasing distance from the Start node
 * based on their "heuristic distance"
 * 
 * heuristic distance = distance_from_start + distance_to_finish
 * 
 * @param {Object[]<Node>} unvisitedNodes All unvisited nodes in the grid
 * @param {Object<Node>} finishNode The grid's Finish node
 */
function sortNodesByDistance(unvisitedNodes, finishNode) {
    unvisitedNodes.sort(function (nodeA, nodeB) {
        if (nodeA.heuristicDistance - nodeB.heuristicDistance === 0) {
            // if heuristic distance is the same, sort by closest to Finish node
            if (getDistanceFromFinish(nodeA, finishNode) < getDistanceFromFinish(nodeB, finishNode)) {
                return -1;
            }
            return 1;
        } 
        return nodeA.heuristicDistance - nodeB.heuristicDistance;
    });
}

/**
 * Calculates the minimum distance to travel from the current node
 * to the Finish node
 * 
 * @param {Object<Node>} currentNode The current node being considered
 * @param {Object<Node>} finishNode The grid's Finish node
 * @returns {number} The minimum distance to the Finish node
 */
function getDistanceFromFinish(currentNode, finishNode) {
    const distX = Math.abs(currentNode.row - finishNode.row);
    const distY = Math.abs(currentNode.col - finishNode.col);

    return distX + distY;
}

/**
 * Increases the unvisited neighbor's 'distance' by 1 beacuse
 * it is one node farther away fromt the start node.
 * Also sets the 'heurisitcDistance' for the currentNode 
 * 
 * @param {Object<Node>} currentNode Node that was just visited 
 * @param {Object<Node>} finishNode The grid's Finish node
 * @param {Object[][]<Node>} grid The current grid state
 */
function updateUnvisitedNeighbors(currentNode, finishNode, grid) {
    const neighbors = getUnvisitedNeighbors(currentNode, grid);

    for (const neighbor of neighbors) {
        neighbor.heuristicDistance = getDistanceFromFinish(neighbor, finishNode);
        neighbor.previousNode = currentNode;
    }
}

/**
 * Returns all unvisited neighbors of currentNode
 * 
 * @param {Object<Node>} currentNode Node that was just visited 
 * @param {Object[][]<Node>} grid The current grid state
 * @returns {Object[]<Node>} All unvisited neighbors of currentNode
 */
function getUnvisitedNeighbors(currentNode, grid) {
    const neighbors = []; 
    const {row, col} = currentNode;

    if (col < grid[0].length-1) neighbors.push(grid[row][col+1]);
    if (row > 0) neighbors.push(grid[row-1][col]);
    if (col > 0) neighbors.push(grid[row][col-1]);
    if (row < grid.length-1) neighbors.push(grid[row+1][col]);
    
    return neighbors.filter(neighbor => !neighbor.isVisited);
}
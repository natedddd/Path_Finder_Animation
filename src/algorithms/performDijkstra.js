/**
 * Performs Dijkstra's algorithm to find the shortest
 * path from a Start to Finish node
 * 
 * @param {Object[][]<Node>} grid The current grid state
 * @param {Object} startNode The grid's Start node
 * @param {Object} finishNode The grid's Finish node
 * @returns {Object[]<Node>} All visited nodes in order
 */
export function performDijkstra(grid, startNode, finishNode) {
    const visitedNodes = [];
    const unvisitedNodes = getAllNodes(grid);

    startNode.distance = 0;

    while (unvisitedNodes.length > 0) {
        sortNodesByDistance(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();

        // console.log("Closest node is: ")
        
        // if the closest node is a wall, skip visiting it
        if (closestNode.nodeType === "wall-node" || 
            closestNode.nodeType === "wall-node-maze") continue;

        // condition where no path is possible
        if (closestNode.distance === Infinity) return visitedNodes;

        closestNode.isVisited = true;
        visitedNodes.push(closestNode);

        if (closestNode === finishNode) return visitedNodes;
        updateUnvisitedNeighbors(closestNode, grid);
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
 * Sorts the unvisited nodes in increasing distance from the start node
 * 
 * @param {Object[]<Node>} unvisitedNodes All unvisited nodes in the grid
 */
function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

/**
 * Increases the unvisited neighbor's 'distance' by 1 beacuse
 * it is one node farther away fromt the start node
 * 
 * @param {Object<Node>} currentNode Node that was just visited
 * @param {Object[][]<Node>} grid The current grid state
 */
function updateUnvisitedNeighbors(currentNode, grid) {
    const neighbors = getUnvisitedNeighbors(currentNode, grid);

    for (const neighbor of neighbors) {
        neighbor.distance = currentNode.distance + 1;
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

/**
 * Returns node in the shortest path order from Start to Finish
 * 
 * @param {Object<Node>} finishNode The grid's Finish node 
 * @returns {Object[]<Node>} The nodes that make the shortest path returned
 *                           in order from Start to Finish Node
 */
export function getNodesInShortestPathOrder(finishNode) {
    const shortestPathNodes = [];
    let currentNode = finishNode;
    while (currentNode != null) {
        shortestPathNodes.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    // case where the only node in the path is the end node
    // and no path can be found
    if (shortestPathNodes.length === 1) return []; 
    return shortestPathNodes;
}
/**
 * This commonAlgorithmFunctions module serves as a central place where
 * common sorting, updating, and get methods that are used across multiple
 * algorithm can be located. 
 * 
 * This module is implemented to reduce the need for duplicate code in multiple 
 * different files, as well as easy maintainability in the future.
 */

/**
 * Returns node in the shortest path order from Start to Finish
 * 
 * @param {Object<Node>} finishNode The grid's Finish node 
 * @param {Object<Node>} detourNode The grid's Detour node
 * @param {Boolean} hasDetour Indicates whether there is a detour node in the grid
 * @returns {Object[]<Node>} The nodes that make the shortest path returned
 *                           in order from Start to Finish Node
 */
 export function getNodesInShortestPathOrder(finishNode, detourNode, hasDetour) {
    const shortestPathNodes = [];
    let currentNode = finishNode;
    let isBuildingDetourPath = false;

    while (currentNode != null) {

        if (currentNode == detourNode && hasDetour) isBuildingDetourPath = true;
        shortestPathNodes.unshift(currentNode);

        if (isBuildingDetourPath) {
            currentNode = currentNode.previousNodeDetour;
        } else {
            currentNode = currentNode.previousNode;
        }
    }
    // case where the only node in the path is the end node
    // and no path can be found
    if (shortestPathNodes.length === 1) return []; 
    console.log(shortestPathNodes.length);
    return shortestPathNodes;
}

/**
 * Returns all of the nodes in the grid
 * 
 * @param {Object[][]<Node>} grid The current grid state
 * @returns {Object[]<Node>} All nodes in the grid
 */
export function getAllNodes(grid) {
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
export function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

/**
 * Increases the unvisited neighbor's 'distance' by 1 beacuse
 * it is one node farther away fromt the start node
 * 
 * @param {Object[][]<Node>} grid The current grid state
 * @param {Object<Node>} currentNode Node that was just visited
 * @param {Boolean} hasDetour Indicates whether there is a detour node in the grid
 */
export function updateUnvisitedNeighbors(grid, currentNode, hasDetour) {
    const neighbors = getUnvisitedNeighbors(grid, currentNode);

    for (const neighbor of neighbors) {
        neighbor.distance = currentNode.distance + 1;

        if (hasDetour) {
            neighbor.previousNodeDetour = currentNode;
        } else {
            neighbor.previousNode = currentNode;
        }
    }
}

/**
 * Returns all unvisited neighbors of currentNode
 * 
 * @param {Object[][]<Node>} grid The current grid state
 * @param {Object<Node>} currentNode Node that was just visited 
 * @returns {Object[]<Node>} All unvisited neighbors of currentNode
 */
export function getUnvisitedNeighbors(grid, currentNode) {
    const neighbors = []; 
    const {row, col} = currentNode;

    if (col < grid[0].length-1) neighbors.push(grid[row][col+1]);
    if (row > 0) neighbors.push(grid[row-1][col]);
    if (col > 0) neighbors.push(grid[row][col-1]);
    if (row < grid.length-1) neighbors.push(grid[row+1][col]);
    
    return neighbors.filter(neighbor => !neighbor.isVisited);
}

/**
 * Calculates the minimum distance to travel from the current node
 * to the Finish node
 * 
 * @param {Object<Node>} currentNode The current node being considered
 * @param {Object<Node>} targetNode The node currently being target. Either Detour or Finish node
 * @returns {number} The minimum distance to the Finish node
 */
export function getDistanceFromTarget(currentNode, targetNode) {
    const distX = Math.abs(currentNode.row - targetNode.row);
    const distY = Math.abs(currentNode.col - targetNode.col);

    return distX + distY;
}

/**
 * Resets necessary attributes to allow overlap (revisiting)
 * when searching from the Detour node to the Finish node
 * 
 * @param {Object[][]<Node>} grid The current grid state
 * @param {Object<Node>} startNode The grid's Start node
 * @param {Object<Node>} finishNode The grid's Finish node
 * @param {Object<Node>} detourNode The grid's Detour node
 */
export function resetVisitedandDistance(grid, startNode, finishNode, detourNode) {
    for (let row of grid) {
        for (let node of row) {
            if (node === startNode || node === finishNode ||
                node === detourNode) continue;

            const tempNode = {
                ...node,
                isVisited: false,
                distance: Infinity,
                heuristicDistance: Infinity,
            }
            grid[node.row][node.col] = tempNode;
        }
    }
}
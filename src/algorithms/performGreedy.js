/**
 * Performs Greedy search algorithm to find the local optimal
 * move which may not be the global optimal
 * 
 * @param {Object[][]<Node>} grid The current grid state
 * @param {Object<Node>} startNode The grid's Start node
 * @param {Object<Node>} finishNode The grid's Finish node
 * @returns {Object[]<Node>} All visited nodes in order
 */
 export default function performGreedy(grid, startNode, finishNode, detourNode, hasDetour) {
    const visitedNodes = [];
    let unvisitedNodes = getAllNodes(grid);

    if (hasDetour) {
        startNode.heuristicDistance = getDistanceFromTarget(startNode, detourNode);
    } else {
        startNode.heuristicDistance = getDistanceFromTarget(startNode, finishNode);
    }

    if (hasDetour) {
        while (unvisitedNodes.length > 0) {
            sortNodesByDistance(unvisitedNodes, detourNode);
            const closestNode = unvisitedNodes.shift();
            
            // if the closest node is a wall, skip visiting it
            if (closestNode.nodeType === "wall-node" || 
                closestNode.nodeType === "wall-node-maze") continue;
    
            // condition where no path is possible
            if (closestNode.heuristicDistance === Infinity) return visitedNodes;
    
            closestNode.isVisited = true;
            visitedNodes.push(closestNode);
    
            if (closestNode === detourNode) break;
            updateUnvisitedNeighbors(grid, closestNode, finishNode, detourNode, hasDetour);
        }
        /**
         * Reset all of the visited states and distance of previously
         * visited nodes. Necessary for the second search to work properly
         */ 
        resetVisitedandDistance(grid, startNode, finishNode, detourNode);
        unvisitedNodes = getAllNodes(grid);
        detourNode.heuristicDistance = getDistanceFromTarget(detourNode, finishNode);
        startNode.heuristicDistance = Infinity;
        finishNode.heuristicDistance = Infinity;
        finishNode.isVisited = false;
        startNode.isVisited = false;
        hasDetour = false;
    }
    while (unvisitedNodes.length > 0) {
        sortNodesByDistance(unvisitedNodes, finishNode);
        const closestNode = unvisitedNodes.shift();
        console.log(closestNode)
        // if the closest node is a wall, skip visiting it
        if (closestNode.nodeType === "wall-node" || 
            closestNode.nodeType === "wall-node-maze") continue;

        // condition where no path is possible
        if (closestNode.heuristicDistance === Infinity) return visitedNodes;
        console.log("HERE")
        closestNode.isVisited = true;
        visitedNodes.push(closestNode);

        if (closestNode === finishNode) return visitedNodes;
        console.log("HERE2")
        updateUnvisitedNeighbors(grid, closestNode, finishNode, detourNode, hasDetour);
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
 * @param {Object<Node>} targetNode The grid's Finish node
 */
function sortNodesByDistance(unvisitedNodes, targetNode) {
    unvisitedNodes.sort(function (nodeA, nodeB) {
        if (nodeA.heuristicDistance - nodeB.heuristicDistance === 0) {
            // if heuristic distance is the same, sort by closest to Finish node
            if (getDistanceFromTarget(nodeA, targetNode) < getDistanceFromTarget(nodeB, targetNode)) {
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
 * @param {Object<Node>} targetNode The grid's Finish node
 * @returns {number} The minimum distance to the Finish node
 */
function getDistanceFromTarget(currentNode, targetNode) {
    const distX = Math.abs(currentNode.row - targetNode.row);
    const distY = Math.abs(currentNode.col - targetNode.col);

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
function updateUnvisitedNeighbors(grid, currentNode, finishNode, detourNode, hasDetour) {
    const neighbors = getUnvisitedNeighbors(grid, currentNode);

    for (const neighbor of neighbors) {
        if (hasDetour) {
            neighbor.heuristicDistance = getDistanceFromTarget(neighbor, detourNode);
            neighbor.previousNodeDetour = currentNode;
        } else {
            neighbor.heuristicDistance = getDistanceFromTarget(neighbor, finishNode);
            neighbor.previousNode = currentNode;
        }
    }
}

/**
 * Returns all unvisited neighbors of currentNode
 * 
 * @param {Object<Node>} currentNode Node that was just visited 
 * @param {Object[][]<Node>} grid The current grid state
 * @returns {Object[]<Node>} All unvisited neighbors of currentNode
 */
function getUnvisitedNeighbors(grid, currentNode) {
    const neighbors = []; 
    const {row, col} = currentNode;

    if (col < grid[0].length-1) neighbors.push(grid[row][col+1]);
    if (row > 0) neighbors.push(grid[row-1][col]);
    if (col > 0) neighbors.push(grid[row][col-1]);
    if (row < grid.length-1) neighbors.push(grid[row+1][col]);
    
    return neighbors.filter(neighbor => !neighbor.isVisited);
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
 function resetVisitedandDistance(grid, startNode, finishNode, detourNode) {
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
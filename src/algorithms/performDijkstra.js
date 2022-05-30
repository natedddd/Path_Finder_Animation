/**
 * Performs Dijkstra's algorithm to find the shortest
 * path from a Start to Finish node
 * 
 * @param {Object[][]<Node>} grid The current grid state
 * @param {Object<Node>} startNode The grid's Start node
 * @param {Object<Node>} finishNode The grid's Finish node
 * @returns {Object[]<Node>} All visited nodes in order
 */
export function performDijkstra(grid, startNode, finishNode, detourNode, hasDetour) {
    const visitedNodes = [];
    let unvisitedNodes = getAllNodes(grid);
    startNode.distance = 0;
    
    if (hasDetour) {
        while (unvisitedNodes.length > 0) {
            sortNodesByDistance(unvisitedNodes);
            const closestNode = unvisitedNodes.shift();
            
            // if the closest node is a wall, skip visiting it
            if (closestNode.nodeType === "wall-node" || 
            closestNode.nodeType === "wall-node-maze") continue;
            
            // condition where no path is possible
            if (closestNode.distance === Infinity) return visitedNodes;
            
            closestNode.isVisited = true;
            visitedNodes.push(closestNode);
            
            if (closestNode === detourNode) break;
            updateUnvisitedNeighbors(grid, closestNode, hasDetour);
        }
        
        /**
         * Reset all of the visited states and distance of previously
         * visited nodes. Necessary for the second search to work properly
         */ 
        resetVisitedandDistance(grid, startNode, finishNode, detourNode);
        unvisitedNodes = getAllNodes(grid);
        detourNode.distance = 0;
        startNode.distance = Infinity;
        finishNode.distance = Infinity;
        finishNode.isVisited = false;
        startNode.isVisited = false;
        hasDetour = false;
    }

    while (unvisitedNodes.length > 0) {
        sortNodesByDistance(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();

        // If the closest node is a wall, skip visiting it
        if (closestNode.nodeType === "wall-node" || 
            closestNode.nodeType === "wall-node-maze") continue;

        // Condition where no path is possible
        if (closestNode.distance === Infinity) return visitedNodes;

        closestNode.isVisited = true;
        visitedNodes.push(closestNode);

        if (closestNode.nodeType === "finish-node") return visitedNodes;
        updateUnvisitedNeighbors(grid, closestNode, hasDetour);
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
function updateUnvisitedNeighbors(grid, currentNode, hasDetour) {
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
            }
            grid[node.row][node.col] = tempNode;
        }
    }
}

/**
 * Returns node in the shortest path order from Start to Finish
 * 
 * @param {Object<Node>} finishNode The grid's Finish node 
 * @returns {Object[]<Node>} The nodes that make the shortest path returned
 *                           in order from Start to Finish Node
 */
export function getNodesInShortestPathOrder(finishNode, detourNode, hasDetour) {
    const shortestPathNodes = [];
    let currentNode = finishNode;
    let isBuildingDetourPath = false;
    console.log("In getNodeInShortestPath");
    let x = 0;
    while (currentNode != null) {
        console.log(currentNode);

        if (currentNode == detourNode && hasDetour) isBuildingDetourPath = true;
        shortestPathNodes.unshift(currentNode);

        if (isBuildingDetourPath) {
            currentNode = currentNode.previousNodeDetour;
        } else {
            currentNode = currentNode.previousNode;
        }

        // if (x === 100) break;
        x++;
    }
    // case where the only node in the path is the end node
    // and no path can be found
    if (shortestPathNodes.length === 1) return []; 
    console.log(shortestPathNodes.length);
    return shortestPathNodes;
}
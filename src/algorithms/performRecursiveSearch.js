/**
 * Performs a recursive search to find the shortest
 * path from a Start to Finish node.
 * Searches in order of: below, left, above, right
 * 
 * @param {Object[][]<Node>} grid The current grid state
 * @param {Object<Node>} startNode The grid's Start node
 * @param {Object<Node>} finishNode The grid's Finish node
 * @param {Object<Node>} detourNode The grid's Detour node
 * @param {Boolean} hasDetour Indicates whether there is a detour node in the grid
 * @returns {Object[]<Node>} All visited nodes in order
 */
export default function performRecursiveSearch(grid, startNode, finishNode, detourNode, hasDetour) {
    const visitedNodes = [];
    let stack = [];
    startNode.isVisited = true;
    stack.push(startNode);

    updateUnvisitedNeighbors(grid, startNode, hasDetour);
    let neighbors = getUnvisitedNeighbors(grid, startNode, hasDetour);
    stack = stack.concat(neighbors);
    
    if (hasDetour) {
        while (stack.length > 0) {
            const currentNode = stack.pop();
            
            // if the closest node is a wall, skip visiting it
            if (currentNode.nodeType === "wall-node" || 
                currentNode.nodeType === "wall-node-maze") continue;
            
            neighbors = getUnvisitedNeighbors(grid, currentNode, hasDetour);
            stack = stack.concat(neighbors);
    
            currentNode.isVisited = true;
            visitedNodes.push(currentNode);
    
            if (currentNode === detourNode) break;
            updateUnvisitedNeighbors(grid, currentNode, hasDetour);
        }
        if (stack.length === 0) return visitedNodes;
        /**
         * Reset all of the visited states and distance of previously
         * visited nodes. Necessary for the second search to work properly
         */ 
        resetVisitedandDistance(grid, startNode, finishNode, detourNode);
        clearArray(stack);
        detourNode.isVisited = true;
        stack.push(detourNode);
    
        hasDetour = false;
        updateUnvisitedNeighbors(grid, detourNode, hasDetour);
        neighbors = getUnvisitedNeighbors(grid, detourNode, hasDetour);
        stack = stack.concat(neighbors);

        finishNode.isVisited = false;
        startNode.isVisited = false;
    }
    while (stack.length > 0) {
        const currentNode = stack.pop();

        // if the closest node is a wall, skip visiting it
        if (currentNode.nodeType === "wall-node" || 
            currentNode.nodeType === "wall-node-maze") continue;
        
        neighbors = getUnvisitedNeighbors(grid, currentNode, hasDetour);
        stack = stack.concat(neighbors);

        currentNode.isVisited = true;
        visitedNodes.push(currentNode);

        if (currentNode === finishNode) return visitedNodes;
        updateUnvisitedNeighbors(grid, currentNode, hasDetour);
    }
    return visitedNodes;
}

/**
 * Returns all unvisited neighbors of currentNode
 * 
 * @param {Object<Node>} currentNode Node that was just visited 
 * @param {Object[][]<Node>} grid The current grid state
 * @returns {Object[]<Node>} All unvisited neighbors of currentNode
 */
 function getUnvisitedNeighbors(grid, currentNode, hasDetour) {
    let neighbors = []; 
    const {row, col} = currentNode;
    if (col < grid[0].length-1) neighbors.push(grid[row][col+1]); // right 
    if (row > 0) neighbors.push(grid[row-1][col]); // up
    if (col > 0) neighbors.push(grid[row][col-1]); // left
    if (row < grid.length-1) neighbors.push(grid[row+1][col]); // down

    if (hasDetour) {
        return neighbors.filter( neighbor => (!neighbor.isVisited) );
    } 
    return neighbors.filter( neighbor => (!neighbor.isVisited) );
}

/**
 * Increases the unvisited neighbor's 'distance' by 1 beacuse
 * it is one node farther away fromt the start node
 * 
 * @param {Object[][]<Node>} grid The current grid state
 * @param {Object<Node>} currentNode Node that was just visited
 */
 function updateUnvisitedNeighbors(grid, currentNode, hasDetour) {
    const neighbors = getUnvisitedNeighbors(grid, currentNode, hasDetour);

    for (const neighbor of neighbors) {
        if (hasDetour) {
            neighbor.previousNodeDetour = currentNode;
        } else {
            neighbor.previousNode = currentNode;
        }
    }
}

/**
 * Empties a given array
 * 
 * @param {Array} array Given array
 */
function clearArray(array) {
    while (array.length) {
        array.pop();
    }
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
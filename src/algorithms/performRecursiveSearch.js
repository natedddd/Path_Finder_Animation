/**
 * Performs a recursive search to find the shortest
 * path from a Start to Finish node.
 * Searches in order of: below, left, above, right
 * 
 * @param {Object[][]<Node>} grid The current grid state
 * @param {Object<Node>} startNode The grid's Start node
 * @param {Object<Node>} finishNode The grid's Finish node
 * @returns {Object[]<Node>} All visited nodes in order
 */
export default function performRecursiveSearch(grid, startNode, finishNode) {
    const visitedNodes = [];
    let stack = [];
    let neighbors = getUnvisitedNeighbors(grid, startNode);
    stack = stack.concat(neighbors);
    
    console.log(stack.length);
    
    while (stack.length > 0) {
        const currentNode = stack.pop();
        console.log("IN RECURSIVE")
        
        // if the closest node is a wall, skip visiting it
        if (currentNode.nodeType === "wall-node" || 
            currentNode.nodeType === "wall-node-maze") continue;
        
        neighbors = getUnvisitedNeighbors(grid, currentNode);
        stack = stack.concat(neighbors);

        currentNode.isVisited = true;
        visitedNodes.push(currentNode);

        if (currentNode === finishNode) return visitedNodes;
        updateUnvisitedNeighbors(grid, currentNode);
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
 function getUnvisitedNeighbors(grid, currentNode) {
    const neighbors = []; 
    const {row, col} = currentNode;
    console.log(grid.length-1)
    if (col < grid[0].length-1) neighbors.push(grid[row][col+1]); // right 
    if (row > 0) neighbors.push(grid[row-1][col]); // up
    if (col > 0) neighbors.push(grid[row][col-1]); // left
    if (row < grid.length-1) neighbors.push(grid[row+1][col]); // down
    
    return neighbors.filter( neighbor => (!neighbor.isVisited && neighbor.nodeType != "start-node") );
}

/**
 * Increases the unvisited neighbor's 'distance' by 1 beacuse
 * it is one node farther away fromt the start node
 * 
 * @param {Object[][]<Node>} grid The current grid state
 * @param {Object<Node>} currentNode Node that was just visited
 */
 function updateUnvisitedNeighbors(grid, currentNode) {
    const neighbors = getUnvisitedNeighbors(grid, currentNode);

    for (const neighbor of neighbors) {
        neighbor.previousNode = currentNode;
    }
}
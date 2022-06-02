/**
 * Performs Dijkstra's algorithm to find the shortest
 * path from a Start to Finish node
 * 
 * @param {Object[][]<Node>} grid The current grid state
 * @param {Object<Node>} startNode The grid's Start node
 * @param {Object<Node>} finishNode The grid's Finish node
 * @returns {Object[]<Node>} All visited nodes in order
 */
 export default function performBiDijkstra(grid, startNode, finishNode) {
    const visitedNodes = [];
    const unvisitedNodes = getAllNodes(grid);
    const unvisitedHeurisiticNodes = getAllNodes(grid);
    
    startNode.distance = 0;
    finishNode.heuristicDistance = 0;

    // edge condition where the start and finish node are side-by-side
    let neighbors = getUnvisitedNeighbors(grid, startNode);
    neighbors = neighbors.filter(neighbor => neighbor.nodeType === "finish-node");
    if (neighbors.length) {
        finishNode.previousNode = startNode;
        visitedNodes.push(startNode);
        visitedNodes.push(finishNode);
        return visitedNodes;
    }

    while (unvisitedNodes.length > 0) {
        /******** Dikstra from startNode *********/
        sortNodesByDistance(unvisitedNodes);
        let closestNode = unvisitedNodes.shift();
        
        // if the closest node is a wall, skip visiting it
        if (closestNode.nodeType === "wall-node" || 
        closestNode.nodeType === "wall-node-maze") continue;
        
        // condition where no path is possible
        if (closestNode.distance === Infinity) return visitedNodes;

        // case where the closestNode has been visited from the finishNode dijkstra
        if (closestNode.isVisitedByFinish) {
            connectShortestPaths(grid, closestNode);
            return visitedNodes;
        }
        
        // mark as visited and push
        closestNode.isVisited = true;
        visitedNodes.push(closestNode);
        updateUnvisitedNeighbors(grid, closestNode);
        
        /******** Dikstra from finishNode *********/
        sortNodesByHeuristicDistance(unvisitedHeurisiticNodes);
        closestNode = unvisitedHeurisiticNodes.shift();
        
        // if the closest node is a wall, skip visiting it
        if (closestNode.nodeType === "wall-node" || 
        closestNode.nodeType === "wall-node-maze") continue;
        
        // condition where no path is possible
        if (closestNode.heuristicDistance === Infinity) return visitedNodes;
        
        // case where the closestNode has been visited from the startNode dijkstra
        if (closestNode.isVisited) {
            connectShortestPaths(grid, closestNode);
            return visitedNodes;
        }

        // mark as visited and push
        closestNode.isVisitedByFinish = true;
        visitedNodes.push(closestNode);
        updateUnvisitedHeuristicNeighbors(grid, closestNode);
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
 * Sorts the unvisited nodes in increasing heurisitic distance from the finish node
 * 
 * @param {Object[]<Node>} unvisitedNodes All unvisited nodes in the grid
 */
function sortNodesByHeuristicDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.heuristicDistance - nodeB.heuristicDistance);
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
        if (neighbor.isVisitedByFinish ||
            neighbor.isVisited) continue;
 
        neighbor.distance = currentNode.distance + 1;
        neighbor.previousNode = currentNode;
    }
}

/**
 * Increases the unvisited neighbor's 'distance' by 1 beacuse
 * it is one node farther away fromt the start node
 * 
 * @param {Object[][]<Node>} grid The current grid state
 * @param {Object<Node>} currentNode Node that was just visited
 */
function updateUnvisitedHeuristicNeighbors(grid, currentNode) {
    const neighbors = getUnvisitedHeuristicNeighbors(grid, currentNode);
    
    for (const neighbor of neighbors) {
        if (neighbor.isVisitedByFinish ||
            neighbor.isVisited) continue;
       
        neighbor.heuristicDistance = currentNode.heuristicDistance + 1;
        neighbor.nextNode = currentNode;
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
    let neighbors = []; 
    const {row, col} = currentNode;

    if (col < grid[0].length-1) neighbors.push(grid[row][col+1]); // right
    if (row > 0) neighbors.push(grid[row-1][col]); // top 
    if (col > 0) neighbors.push(grid[row][col-1]); // left
    if (row < grid.length-1) neighbors.push(grid[row+1][col]); // bottom

    return neighbors.filter(neighbor => !neighbor.isVisited);
}

/**
 * Returns all unvisited neighbors of currentNode
 * 
 * @param {Object[][]<Node>} grid The current grid state
 * @param {Object<Node>} currentNode Node that was just visited 
 * @returns {Object[]<Node>} All unvisited neighbors of currentNode
 */
 function getUnvisitedHeuristicNeighbors(grid, currentNode) {
    const neighbors = []; 
    const {row, col} = currentNode;

    if (col < grid[0].length-1) neighbors.push(grid[row][col+1]); // right
    if (row > 0) neighbors.push(grid[row-1][col]); // top 
    if (col > 0) neighbors.push(grid[row][col-1]); // left
    if (row < grid.length-1) neighbors.push(grid[row+1][col]); // bottom

    return neighbors.filter(neighbor => !neighbor.isVisitedByFinish);
}

/**
 * Connects the shortest path so that it can be visualize. 
 * Works backwards along the Finish node's path from the middle
 * connecting point (where the two Dijkstra's meet) back to the 
 * Finish node
 * 
 * @param {Object[][]<Node>} grid The current grid state
 * @param {Object<Node>} closestNode Node that was just visited 
 */
function connectShortestPaths(grid, closestNode) {
    let neighbors = getUnvisitedNeighbors(grid, closestNode);
    neighbors = neighbors.filter(neighbor => neighbor.isVisitedByFinish)
    sortNodesByHeuristicDistance(neighbors);

    let nodeA = closestNode;
    let nodeB = neighbors[0];

    if (nodeB.nodeType === "finish-node") {
        nodeB.previousNode = nodeA;
        return;
    }

    while (nodeB.nextNode != null) {
        let temp = nodeB.nextNode;
        nodeB.previousNode = nodeA;
        nodeA = nodeB;
        nodeB = temp;
        if (nodeB.nodeType === "finish-node") break;
    }
    nodeB.previousNode = nodeA;
}
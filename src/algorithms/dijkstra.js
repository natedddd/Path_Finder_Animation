

export function dijkstra(grid, startNode, finishNode) {
    const visitedNodes = [];
    const unvisitedNodes = getAllNodes(grid);

    startNode.distance = 0;

    while (unvisitedNodes.length > 0) {
        
        sortNodesByDistance(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();
        
        if (closestNode.nodeType === "wall-node") continue;

        // condition where no path is possible
        if (closestNode.distance === Infinity) return visitedNodes;

        closestNode.isVisited = true;
        visitedNodes.push(closestNode);

        if (closestNode === finishNode) return visitedNodes;
        updateUnvisitedNeighbors(closestNode, grid);
    }
    return visitedNodes;
}

function getAllNodes(grid) {
    const allNodes = [];

    for (const row of grid) {
        for (const node of row) {
            allNodes.push(node);
        }
    }
    return allNodes;
}


function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbors(currentNode, grid) {
    const neighbors = getUnvisitedNeighbors(currentNode, grid);

    for (const neighbor of neighbors) {
        neighbor.distance = currentNode.distance + 1;
        neighbor.previousNode = currentNode;
    }
}


function getUnvisitedNeighbors(currentNode, grid) {
    const neighbors = []; 
    const {row, col} = currentNode;

    if (col < grid[0].length-1) neighbors.push(grid[row][col+1]);
    if (row > 0) neighbors.push(grid[row-1][col]);
    if (col > 0) neighbors.push(grid[row][col-1]);
    if (row < grid.length-1) neighbors.push(grid[row+1][col]);
    
    return neighbors.filter(neighbor => !neighbor.isVisited);
}

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
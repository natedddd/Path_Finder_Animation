/**
 * 
 * @param {*} grid 
 * @param {*} startNode 
 * @param {*} finishNode 
 * @returns 
 */
export default function performAStar(grid, startNode, finishNode) {
    const visitedNodes = [];
    const unvisitedNodes = getAllNodes(grid);
    const currentShortestDist = getDistanceFromFinish(startNode, finishNode);

    startNode.distance = 0;
    startNode.heuristicDistance = getDistanceFromFinish(startNode, finishNode);

    while (unvisitedNodes.length != 0) {
        sortNodesByDistance(unvisitedNodes, finishNode);
        const closestNode = unvisitedNodes.shift();
        
        // if the closest node is a wall, skip visiting it
        if (closestNode.nodeType === "wall-node" || 
            closestNode.nodeType === "wall-node-maze") continue;

        // case where there is no possible path from Start to Finish
        if (closestNode.distance === Infinity) return visitedNodes;

        closestNode.isVisited = true;
        visitedNodes.push(closestNode);

        if (closestNode === finishNode) return visitedNodes;

        updateUnvisitedNeighbors(closestNode, finishNode, grid);
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

function sortNodesByDistance(unvisitedNodes, finishNode) {
    unvisitedNodes.sort(function (nodeA, nodeB) {
        if (nodeA.heuristicDistance - nodeB.heuristicDistance === 0) {
            // if huerisitc distance is the same, sort by closest to Finish
            if (getDistanceFromFinish(nodeA, finishNode) < getDistanceFromFinish(nodeB, finishNode)) {
                return -1;
            }
            return 1;
        } 
        return nodeA.heuristicDistance - nodeB.heuristicDistance;
    });
}

function getDistanceFromFinish(currentNode, finishNode) {
    const distX = Math.abs(currentNode.row - finishNode.row);
    const distY = Math.abs(currentNode.col - finishNode.col);

    return distX + distY;
}

function updateUnvisitedNeighbors(currentNode, finishNode, grid) {
    const neighbors = getUnvisitedNeighbors(currentNode, grid);

    for (const neighbor of neighbors) {
        neighbor.distance = currentNode.distance + 1;
        neighbor.heuristicDistance = neighbor.distance + getDistanceFromFinish(neighbor, finishNode);
        // console.log(neighbor.heuristicDistance);
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
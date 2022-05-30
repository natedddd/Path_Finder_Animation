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
            console.log("break 1")
            console.log(closestNode)
            // connectShortestPathFromStart(grid, closestNode);
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
            console.log("break 2")
            console.log(closestNode)
            connectShortestPathFromFinish(grid, closestNode, startNode);
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
 * @param {Object<Node>} currentNode Node that was just visited
 * @param {Object[][]<Node>} grid The current grid state
 */
function updateUnvisitedNeighbors(grid, currentNode) {
    const neighbors = getUnvisitedNeighbors(grid, currentNode);
    // console.log("in update unvisited")
    // console.log(currentNode)
    for (const neighbor of neighbors) {
        if (neighbor.isVisitedByFinish) continue;
        neighbor.distance = currentNode.distance + 1;
        neighbor.previousNode = currentNode;
    }
}

/**
 * Increases the unvisited neighbor's 'distance' by 1 beacuse
 * it is one node farther away fromt the start node
 * 
 * @param {Object<Node>} currentNode Node that was just visited
 * @param {Object[][]<Node>} grid The current grid state
 */
function updateUnvisitedHeuristicNeighbors(grid, currentNode) {
    const neighbors = getUnvisitedHeuristicNeighbors(grid, currentNode);
    
    for (const neighbor of neighbors) {
        if (neighbor.isVisited) continue;
        neighbor.heuristicDistance = currentNode.heuristicDistance + 1;
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
function getUnvisitedNeighbors(grid, currentNode) {
    let neighbors = []; 
    const {row, col} = currentNode;

    if (row == 12 &&  col == 12) {
        console.log("HERE")
    }

    if (col < grid[0].length-1) neighbors.push(grid[row][col+1]); // right
    if (row > 0) neighbors.push(grid[row-1][col]); // top 
    if (col > 0) neighbors.push(grid[row][col-1]); // left
    if (row < grid.length-1) neighbors.push(grid[row+1][col]); // bottom
    
    neighbors = neighbors.filter(neighbor => !neighbor.isVisited)
    console.log(neighbors)

    return neighbors.filter(neighbor => !neighbor.isVisited);
}

/**
 * Returns all unvisited neighbors of currentNode
 * 
 * @param {Object<Node>} currentNode Node that was just visited 
 * @param {Object[][]<Node>} grid The current grid state
 * @returns {Object[]<Node>} All unvisited neighbors of currentNode
 */
 function getUnvisitedHeuristicNeighbors(grid, currentNode) {
    const neighbors = []; 
    const {row, col} = currentNode;

    if (row == 12 &&  col == 12) {
        console.log("HERE")
    }

    if (col > 0) neighbors.push(grid[row][col-1]); // left
    if (row > 0) neighbors.push(grid[row-1][col]); // top 
    if (col < grid[0].length-1) neighbors.push(grid[row][col+1]); // right
    if (row < grid.length-1) neighbors.push(grid[row+1][col]); // bottom

    return neighbors.filter(neighbor => !neighbor.isVisitedByFinish);
}

// function connectShortestPathFromStart(grid, closestNode) {
//     let neighbors = getUnvisitedNeighbors(grid, closestNode);
//     let connectingNode;

//     // Only consider nodes that have been visited by the Finish Dijktra,
//     // and pick the node that is has the smallest distance from the Finish
//     neighbors = neighbors.filter(neighbor => neighbor.isVisitedByFinish);
//     sortNodesByHeuristicDistance(neighbors);
//     connectingNode = neighbors[0];

//     while (connectingNode.previousNode !== null) {
//         const temp = connectingNode.previousNode;
//         connectingNode.previousNode = closestNode;
//         closestNode = connectingNode;
//         connectingNode = temp;
//     }
//     connectingNode.previousNode = closestNode;
// }

function connectShortestPathFromFinish(grid, closestNode, startNode) {
    let neighbors = getUnvisitedNeighbors(grid, closestNode);
    let connectingNode;
    
    // Only consider nodes that have been visited by the Start Dijktra,
    // and pick the node that is has the smallest distance from the Start
    neighbors = neighbors.filter(neighbor => neighbor.isVisitedByFinish);
    sortNodesByDistance(neighbors);
    connectingNode = neighbors[0];
    // console.log("closest node: ")
    // console.log(closestNode)
    console.log("connectingNode ")
    console.log(connectingNode)


    const closestNodeDistFromStart = getDistanceFromTarget(closestNode, startNode);
    const connectingNodeDistFromStart = getDistanceFromTarget(connectingNode, startNode);

    if (connectingNodeDistFromStart < closestNodeDistFromStart) {
        neighbors = getUnvisitedHeuristicNeighbors(grid, closestNode);
        neighbors = neighbors.filter(neighbor => neighbor.isVisited);
        sortNodesByDistance(neighbors);
        connectingNode = neighbors[0];


        while (closestNode.previousNode !== null) {
            const temp = closestNode.previousNode;
            closestNode.previousNode = connectingNode;
            connectingNode = closestNode;
            closestNode = temp;
            
        }
          closestNode.previousNode = connectingNode;
    } else {
        while (connectingNode.previousNode !== null) {
            const temp = connectingNode.previousNode;
            connectingNode.previousNode = closestNode;
            closestNode = connectingNode;
            connectingNode = temp;
        }
        connectingNode.previousNode = closestNode;
    }

    // while (closestNode.previousNode !== null) {
    //     const temp = closestNode.previousNode;
    //     closestNode.previousNode = connectingNode;
    //     connectingNode = closestNode;
    //     closestNode = temp;
        
    // }
    // closestNode.previousNode = connectingNode;
    // while (connectingNode.previousNode !== null) {
    //     const temp = connectingNode.previousNode;
    //     connectingNode.previousNode = closestNode;
    //     closestNode = connectingNode;
    //     connectingNode = temp;
    // }
    // connectingNode.previousNode = closestNode;
    // console.log("closest node: ")
    // console.log(closestNode)
    // console.log("connectingNode ")
    // console.log(connectingNode)
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
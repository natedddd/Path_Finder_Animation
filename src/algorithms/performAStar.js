import * as commonAlgoFunc from "./commonAlgorithmFunctions";

/**
 * Performs A* search algorithm to find the shortest path from 
 * a Start to Finish node.
 * Uses a heurisitc of distance from node to augment which node
 * to visit next
 * 
 * @param {Object[][]<Node>} grid The current grid state
 * @param {Object<Node>} startNode The grid's Start node
 * @param {Object<Node>} finishNode The grid's Finish node
 * @param {Object<Node>} detourNode The grid's Detour node
 * @param {Boolean} hasDetour Indicates whether there is a detour node in the grid
 * @returns {Object[]<Node>} All visited nodes in order
 */
export default function performAStar(grid, startNode, finishNode, detourNode, hasDetour) {
    const visitedNodes = [];
    let unvisitedNodes = commonAlgoFunc.getAllNodes(grid);
    startNode.distance = 0;

    if (hasDetour) {
        startNode.heuristicDistance = commonAlgoFunc.getDistanceFromTarget(startNode, detourNode);
    } else {
        startNode.heuristicDistance = commonAlgoFunc.getDistanceFromTarget(startNode, finishNode);
    }

    if (hasDetour) {
        while (unvisitedNodes.length > 0) {
            sortNodesByDistance(unvisitedNodes, detourNode);
            const closestNode = unvisitedNodes.shift();
            
            // if the closest node is a wall, skip visiting it
            if (closestNode.nodeType === "wall-node" || 
                closestNode.nodeType === "wall-node-maze") continue;
    
            // condition where no path is possible
            if (closestNode.distance === Infinity) return visitedNodes;
    
            closestNode.isVisited = true;
            visitedNodes.push(closestNode);
    
            if (closestNode === detourNode) break;
            updateUnvisitedNeighbors(grid, closestNode, finishNode, detourNode, hasDetour);
        }
        /**
         * Reset all of the visited states and distance of previously
         * visited nodes. Necessary for the second search to work properly
         */ 
        commonAlgoFunc.resetVisitedandDistance(grid, startNode, finishNode, detourNode);
        unvisitedNodes = commonAlgoFunc.getAllNodes(grid);
        detourNode.distance = 0;
        detourNode.heuristicDistance = commonAlgoFunc.getDistanceFromTarget(detourNode, finishNode);
        startNode.distance = Infinity;
        finishNode.distance = Infinity;
        startNode.heuristicDistance = Infinity;
        finishNode.heuristicDistance = Infinity;
        finishNode.isVisited = false;
        startNode.isVisited = false;
        hasDetour = false;
    }
    while (unvisitedNodes.length > 0) {
        sortNodesByDistance(unvisitedNodes, finishNode);
        const closestNode = unvisitedNodes.shift();
        
        // if the closest node is a wall, skip visiting it
        if (closestNode.nodeType === "wall-node" || 
            closestNode.nodeType === "wall-node-maze") continue;

        // condition where no path is possible
        if (closestNode.distance === Infinity) return visitedNodes;

        closestNode.isVisited = true;
        visitedNodes.push(closestNode);

        if (closestNode === finishNode) return visitedNodes;
        updateUnvisitedNeighbors(grid, closestNode, finishNode, detourNode, hasDetour);
    }
    return visitedNodes;
}

/**
 * Sorts the unvisited nodes in increasing distance from the Start node
 * based on their "heuristic distance"
 * 
 * heuristic distance = distance_from_start + distance_to_target
 * 
 * @param {Object[]<Node>} unvisitedNodes All unvisited nodes in the grid
 * @param {Object<Node>} targetNode The node currently being target. Either Detour or Finish node
 */
function sortNodesByDistance(unvisitedNodes, targetNode) {
    unvisitedNodes.sort(function (nodeA, nodeB) {
        if (nodeA.heuristicDistance - nodeB.heuristicDistance === 0) {
            // if heuristic distance is the same, sort by closest to Finish node
            if (commonAlgoFunc.getDistanceFromTarget(nodeA, targetNode) < commonAlgoFunc.getDistanceFromTarget(nodeB, targetNode)) {
                return -1;
            }
            return 1;
        } 
        return nodeA.heuristicDistance - nodeB.heuristicDistance;
    });
}

/**
 * Increases the unvisited neighbor's 'distance' by 1 beacuse
 * it is one node farther away fromt the start node.
 * Also sets the 'heurisitcDistance' for the currentNode
 *  
 * @param {Object[][]<Node>} grid The current grid state
 * @param {Object<Node>} currentNode Node that was just visited 
 * @param {Object<Node>} finishNode The grid's Finish node
 * @param {Object<Node>} detourNode The grid's Detour node
 * @param {Boolean} hasDetour Indicates whether there is a detour node in the grid
 */
function updateUnvisitedNeighbors(grid, currentNode, finishNode, detourNode, hasDetour) {
    const neighbors = commonAlgoFunc.getUnvisitedNeighbors(grid, currentNode);

    for (const neighbor of neighbors) {
        neighbor.distance = currentNode.distance + 1;
        
        if (hasDetour) {
            neighbor.heuristicDistance = neighbor.distance + commonAlgoFunc.getDistanceFromTarget(neighbor, detourNode);
            neighbor.previousNodeDetour = currentNode;
        } else {
            neighbor.heuristicDistance = neighbor.distance + commonAlgoFunc.getDistanceFromTarget(neighbor, finishNode);
            neighbor.previousNode = currentNode;
        }
    }
}
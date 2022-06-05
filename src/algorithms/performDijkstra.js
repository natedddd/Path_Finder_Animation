import * as commonAlgoFunc from "./commonAlgorithmFunctions";

/**
 * Performs Dijkstra's algorithm to find the shortest
 * path from a Start to Finish node
 * 
 * @param {Object[][]<Node>} grid The current grid state
 * @param {Object<Node>} startNode The grid's Start node
 * @param {Object<Node>} finishNode The grid's Finish node 
 * @param {Object<Node>} detourNode The grid's Detour node
 * @param {Boolean} hasDetour Indicates whether there is a detour node in the grid
 * @returns {Object[]<Node>} All visited nodes in order
 */
export default function performDijkstra(grid, startNode, finishNode, detourNode, hasDetour) {
    const visitedNodes = [];
    let unvisitedNodes = commonAlgoFunc.getAllNodes(grid);
    startNode.distance = 0;
    
    if (hasDetour) {
        while (unvisitedNodes.length > 0) {
            commonAlgoFunc.sortNodesByDistance(unvisitedNodes);
            const closestNode = unvisitedNodes.shift();
            
            // if the closest node is a wall, skip visiting it
            if (closestNode.nodeType === "wall-node" || 
            closestNode.nodeType === "wall-node-maze") continue;
            
            // condition where no path is possible
            if (closestNode.distance === Infinity) return visitedNodes;
            
            closestNode.isVisited = true;
            visitedNodes.push(closestNode);
            
            if (closestNode === detourNode) break;
            commonAlgoFunc.updateUnvisitedNeighbors(grid, closestNode, hasDetour);
        }
        
        /**
         * Reset all of the visited states and distance of previously
         * visited nodes. Necessary for the second search to work properly
         */ 
        commonAlgoFunc.resetVisitedandDistance(grid, startNode, finishNode, detourNode);
        unvisitedNodes = commonAlgoFunc.getAllNodes(grid);
        detourNode.distance = 0;
        startNode.distance = Infinity;
        finishNode.distance = Infinity;
        finishNode.isVisited = false;
        startNode.isVisited = false;
        hasDetour = false;
    }

    while (unvisitedNodes.length > 0) {
        commonAlgoFunc.sortNodesByDistance(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();

        // If the closest node is a wall, skip visiting it
        if (closestNode.nodeType === "wall-node" || 
            closestNode.nodeType === "wall-node-maze") continue;

        // Condition where no path is possible
        if (closestNode.distance === Infinity) return visitedNodes;

        closestNode.isVisited = true;
        visitedNodes.push(closestNode);

        if (closestNode.nodeType === "finish-node") return visitedNodes;
        commonAlgoFunc.updateUnvisitedNeighbors(grid, closestNode, hasDetour);
    }
    return visitedNodes;
}
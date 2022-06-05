import * as commonAlgoFunc from "./commonAlgorithmFunctions";

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

    commonAlgoFunc.updateUnvisitedNeighbors(grid, startNode, hasDetour);
    let neighbors = commonAlgoFunc.getUnvisitedNeighbors(grid, startNode, hasDetour);
    stack = stack.concat(neighbors);
    
    if (hasDetour) {
        while (stack.length > 0) {
            const currentNode = stack.pop();
            
            // if the closest node is a wall, skip visiting it
            if (currentNode.nodeType === "wall-node" || 
                currentNode.nodeType === "wall-node-maze") continue;
            
            neighbors = commonAlgoFunc.getUnvisitedNeighbors(grid, currentNode, hasDetour);
            stack = stack.concat(neighbors);
    
            currentNode.isVisited = true;
            visitedNodes.push(currentNode);
    
            if (currentNode === detourNode) break;
            commonAlgoFunc.updateUnvisitedNeighbors(grid, currentNode, hasDetour);
        }
        if (stack.length === 0) return visitedNodes;
        /**
         * Reset all of the visited states and distance of previously
         * visited nodes. Necessary for the second search to work properly
         */ 
        commonAlgoFunc.resetVisitedandDistance(grid, startNode, finishNode, detourNode);
        clearArray(stack);
        detourNode.isVisited = true;
        stack.push(detourNode);
    
        hasDetour = false;
        commonAlgoFunc.updateUnvisitedNeighbors(grid, detourNode, hasDetour);
        neighbors = commonAlgoFunc.getUnvisitedNeighbors(grid, detourNode, hasDetour);
        stack = stack.concat(neighbors);

        finishNode.isVisited = false;
        startNode.isVisited = false;
    }
    while (stack.length > 0) {
        const currentNode = stack.pop();

        // if the closest node is a wall, skip visiting it
        if (currentNode.nodeType === "wall-node" || 
            currentNode.nodeType === "wall-node-maze") continue;
        
        neighbors = commonAlgoFunc.getUnvisitedNeighbors(grid, currentNode, hasDetour);
        stack = stack.concat(neighbors);

        currentNode.isVisited = true;
        visitedNodes.push(currentNode);

        if (currentNode === finishNode) return visitedNodes;
        commonAlgoFunc.updateUnvisitedNeighbors(grid, currentNode, hasDetour);
    }
    return visitedNodes;
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
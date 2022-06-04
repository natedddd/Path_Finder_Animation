const ARBITRARY_LARGE_NUMBER = 1000;

/**
 * Returns a 'snake' maze wall pattern for the grid
 * 
 * @param {Object[][]<Node>} grid The current grid state
 * @param {Object<Node>} startNode The grid's Start node
 * @param {Object<Node>} finishNode The grid's Finish node
 * @returns {Object[]<Node>} All walls of the maze
 */
export default function getSnakeMaze(grid, startNode, finishNode, detourNode, hasDetour) {
    const mazeWalls = [];
    setGridBorderAsWalls(grid, mazeWalls);
    
    for (let ii = 1; ii < grid.length-1; ii++) {
        for (let jj = 1; jj < grid[0].length-1; jj++) {
            const node = grid[ii][jj];
            if (node === startNode || node === finishNode) continue;
            if (hasDetour && node === detourNode) continue;
            if (node.row % 4 === 0) {
                const isLastFourNodesInOddRow = (node.col / (grid[0].length-6) > 1) && ((node.row+4) % 8) === 0;
                const isFirstFourNodesInEvenRow = node.col % ARBITRARY_LARGE_NUMBER < 5 && node.row % 8 === 0;
                // don't set a wall at these nodes (creates the snake pattern)
                if (isLastFourNodesInOddRow) continue;
                if (isFirstFourNodesInEvenRow) continue;
                const tempNode = {
                    ...node,
                    nodeType: "wall-node-maze",
                }
                mazeWalls.push(tempNode);
            }   
        }
    }
    return mazeWalls;
}

/**
 * Sets all nodes on the grid's boarder to walls
 * 
 * @param {Object[][]<Node>} grid The current grid state
 * @param {Object[]<Node>} mazeWalls Array to store nodes set to walls
 */
function setGridBorderAsWalls(grid, mazeWalls) {
    for (let ii = 0; ii < grid[0].length; ii++) mazeWalls.push(grid[0][ii]); // top
    for (let ii = 0; ii < grid.length; ii++) mazeWalls.push(grid[ii][grid[0].length-1]); // right
    for (let ii = grid[0].length-1; ii > 0; ii--) mazeWalls.push(grid[grid.length-1][ii]); // bottom
    for (let ii = grid.length-1; ii > 0; ii--) mazeWalls.push(grid[ii][0]); // left
}
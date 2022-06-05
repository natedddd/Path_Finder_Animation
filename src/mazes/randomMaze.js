/**
 * Returns the walls of a randomly generated maze in increasing
 * order from row = 0, col = 0.
 * Probability of a node being a wall is 1/3
 * 
 * @param {Object[][]<Node>} grid The current grid state
 * @param {Object<Node>} startNode The grid's Start node
 * @param {Object<Node>} finishNode The grid's Finish node
 *  * @param {Object<Node>} detourNode The grid's Detour node
 * @param {Boolean} hasDetour Indicates whether there is a detour node in the grid
 * @returns {Object[]<Node>} All visited nodes in order 
 */
export default function getRandomMaze(grid, startNode, finishNode, detourNode, hasDetour) {
    const mazeWalls = [];
    
    for (let ii = 0; ii < grid.length; ii++) {
        for (let jj = 0; jj < grid[0].length; jj++) {
            const node = grid[ii][jj];
            if (node === startNode || node === finishNode) continue;
            if (hasDetour && node === detourNode) continue;
            
            // probability of being a wall is 1/3
            const makeWall = Math.floor(Math.random() * 3);
            if (makeWall === 0) {
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

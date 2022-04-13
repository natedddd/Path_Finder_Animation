/**
 * 
 * @param {} grid 
 * @param {*} startNode 
 * @param {*} finishNode 
 * @returns 
 */
export default function maze2(grid, startNode, finishNode) {
    const mazeWalls = [];
    
    for (let ii = 0; ii < grid.length; ii++) {
        for (let jj = 0; jj < grid[0].length; jj++) {
            const node = grid[ii][jj];
            if (node === startNode || node === finishNode) continue;
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

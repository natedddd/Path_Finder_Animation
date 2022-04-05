/**
 * 
 * @param {Object[][]} grid 
 * @param {Object<Node>} startNode 
 * @param {Object<Node>} finishNode 
 * @returns 
 */
export default function getSnakeMaze(grid, startNode, finishNode) {
    const mazeWalls = [];
    setBorderAsWalls(grid, mazeWalls);
    
    for (let ii = 1; ii < grid.length-1; ii++) {
        for (let jj = 1; jj < grid[0].length-1; jj++) {
            const node = grid[ii][jj];
            if (node === startNode || node === finishNode) continue;
            if (node.row % 4 === 0) {
                const isOddRowLastFourNodes = (node.col / (grid[0].length-6) > 1) && ((node.row+4) % 8) === 0;
                const isEvenRowFirstFourNodes = node.col % 1000 < 5 && node.row % 8 === 0;
                if (isOddRowLastFourNodes) continue;
                if (isEvenRowFirstFourNodes) continue;
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

function setBorderAsWalls(grid, mazeWalls) {
    for (let ii = 0; ii < grid[0].length; ii++) mazeWalls.push(grid[0][ii]); // top
    for (let ii = 0; ii < grid.length; ii++) mazeWalls.push(grid[ii][grid[0].length-1]); // right
    for (let ii = grid[0].length-1; ii > 0; ii--) mazeWalls.push(grid[grid.length-1][ii]); // bottom
    for (let ii = grid.length-1; ii > 0; ii--) mazeWalls.push(grid[ii][0]); // left
}
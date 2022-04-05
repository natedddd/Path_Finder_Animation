export default function maze2(grid, startNode, finishNode) {
    const mazeWalls = [];
    // setBorderAsWalls(grid, mazeWalls);
    
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

function setBorderAsWalls(grid, mazeWalls) {
    for (let ii = 0; ii < grid[0].length; ii++) mazeWalls.push(grid[0][ii]); // top
    for (let ii = 0; ii < grid.length; ii++) mazeWalls.push(grid[ii][grid[0].length-1]); // right
    for (let ii = grid[0].length-1; ii > 0; ii--) mazeWalls.push(grid[grid.length-1][ii]); // bottom
    for (let ii = grid.length-1; ii > 0; ii--) mazeWalls.push(grid[ii][0]); // left
}
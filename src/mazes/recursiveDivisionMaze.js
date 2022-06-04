const HORIZONTAL = 0;
const VERTICAL = 1;

/**
 * Recursively divides the current grid state into increasingly
 * smaller size until no new walls can be added
 * 
 * Acknowledgement: This algorithm's implementation was completed
 * using guidance from Jamis Buck's blog post:
 * https://weblog.jamisbuck.org/2011/1/12/maze-generation-recursive-division-algorithm
 * 
 * @param {Object[][]<Node>} grid The current grid state
 * @param {Object<Node>} startNode The grid's Start node
 * @param {Object<Node>} finishNode The grid's Finish node
 * @returns {Object[]<Node>} All walls of the maze
 */
export default function getRecursiveDivisionMaze(grid) {
    const gridWidth = grid[0].length;
    const gridHeight = grid.length;
    const orientation = choose_orientation(gridWidth, gridHeight);
    let mazeWalls = [];
    setBorderAsWalls(grid, mazeWalls);
    mazeWalls = mazeWalls.concat(divide(grid, 1, 1, gridWidth, gridHeight, orientation, mazeWalls)); // 1, 1 for row, col = 1
    mazeWalls.pop(); // removes an empty Object from the mazeWalls
    return mazeWalls;
}

/**
 * Sets all nodes on the grid's boarder to walls
 * 
 * @param {Object[][]<Node>} grid The current grid state
 * @param {Object[]<Node>} mazeWalls Array to store nodes set to walls
 */
function setBorderAsWalls(grid, mazeWalls) {
    for (let ii = 0; ii < grid[0].length; ii++) mazeWalls.push(grid[0][ii]); // top
    for (let ii = 0; ii < grid.length; ii++) mazeWalls.push(grid[ii][grid[0].length-1]); // right
    for (let ii = grid[0].length-1; ii > 0; ii--) mazeWalls.push(grid[grid.length-1][ii]); // bottom
    for (let ii = grid.length-1; ii > 0; ii--) mazeWalls.push(grid[ii][0]); // left
}

/**
 * Recursively divideds the grid in smaller sections by adding walls
 * until the seconds cannot get any smaller
 * 
 * @param {Object[][]<Node>} grid The current grid state
 * @param {number} row The top most row of the current rectangle being divided 
 * @param {number} col The left most col of the current rectangle being divided
 * @param {number} width The width of the current rectangle being divided
 * @param {number} height The height of the current rectangle being divided
 * @param {number} orientation The orientation of the wall that is about to be drawn
 * @param {Object[]<Node>} mazeWalls The previously added maze walls
 * @returns {Object[]<Node>} All walls added to the maze 
 */
function divide(grid, row, col, width, height, orientation, mazeWalls) {
    if (width < 3 || height < 3) return mazeWalls;
    const isHorizontal = orientation === HORIZONTAL;
    
    // randomly creates the row & col of the new wall
    let randRow = Math.floor(Math.random() * (height-2)); 
    let randCol = Math.floor(Math.random() * (width-2));
    let newWallRow = row + (isHorizontal ? randRow + 1: 0);
    let newWallCol = col + (isHorizontal ? 0 : randCol + 1);
    
    // ensures that all rows & cols are added on odd values
    if (isHorizontal) {
        if (newWallRow%2 === 0 && newWallRow > 0) newWallRow = newWallRow-1;  
    } else {
        if (newWallCol%2 === 0 && newWallCol > 0) newWallCol = newWallCol-1;
    }
    
    // randomly generates the path through the new wall being created
    randRow = Math.floor(Math.random() * height);
    randCol = Math.floor(Math.random() * width);
    let passageRow = newWallRow + (isHorizontal ? 0 : randRow)
    let passageCol = newWallCol + (isHorizontal ? randCol : 0)

    // ensures that all passage ways intersect with paths, not walls
    if (isHorizontal) {
        if (passageCol%2 === 1 && passageCol > 0) passageCol = passageCol-1;
    } else {
        if (passageRow%2 === 1 && passageRow > 0) passageRow = passageRow-1;
    }

    let directionRow = isHorizontal ? 0 : 1;
    let directionCol = isHorizontal ? 1 : 0;
    let length = isHorizontal ? width : height
    
    // draws the wall depending on where and the direction
    for (let ii = 0; ii < length; ii++) {
        if (newWallCol != passageCol || newWallRow != passageRow) {
            const node = grid[newWallRow-1][newWallCol-1];
            mazeWalls.push(node);
        }
        newWallRow += directionRow;
        newWallCol += directionCol;
    }

    // One section of the newly divided grid, recursively repeats
    let rect1Row = row;
    let rect1Col = col;
    let newWidth = isHorizontal ? width : newWallCol-col;
    let newHeight = isHorizontal ? newWallRow-row : height;
    divide(grid, rect1Row, rect1Col, newWidth, newHeight, choose_orientation(newWidth, newHeight), mazeWalls);
    
    // The second section of the newly divided grid, recursively repeats
    let rect2Row = isHorizontal ? newWallRow+1 : row;
    let rect2Col = isHorizontal ? col : newWallCol+1;
    newWidth = isHorizontal ? width : width+col-newWallCol-1;
    newHeight = isHorizontal ? height+row-newWallRow-1 : height;
    divide(grid, rect2Row, rect2Col, newWidth, newHeight, choose_orientation(newWidth, newHeight), mazeWalls);
}

/**
 * Determines the orientation of the new walls being added
 * 
 * @param {number} width The width of the current rectangle being divided
 * @param {number} height The height of the current rectangle being divided
 */
function choose_orientation(width, height) {
    if (width < height) {
        return HORIZONTAL;
    } else if (height < width) {
        return VERTICAL;
    }
    if (Math.floor(Math.random() * 2) === 0) return VERTICAL;
    return HORIZONTAL;
}
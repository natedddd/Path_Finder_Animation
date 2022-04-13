const HORIZONTAL = 0;
const VERTICAL = 1;

/**
 * 
 * 
 * Acknowledgement: This algorithm's implementation was completed
 * using guidance from Jamis Buck's blog post:
 * https://weblog.jamisbuck.org/2011/1/12/maze-generation-recursive-division-algorithm
 * 
 * @param {*} grid 
 * @param {*} startNode 
 * @param {*} finishNode 
 * @returns 
 */
export default function getRecursiveDivisionMaze(grid, startNode, finishNode) {
    const gridWidth = grid[0].length;
    const gridHeight = grid.length;
    const orientation = choose_orientation(gridWidth, gridHeight);
    let mazeWalls = [];
    setBorderAsWalls(grid, mazeWalls);
    mazeWalls = mazeWalls.concat(divide(grid, 1, 1, gridWidth, gridHeight, orientation, mazeWalls));
    mazeWalls.pop();
    console.log(mazeWalls);
    return mazeWalls;
}

function setBorderAsWalls(grid, mazeWalls) {
    for (let ii = 0; ii < grid[0].length; ii++) mazeWalls.push(grid[0][ii]); // top
    for (let ii = 0; ii < grid.length; ii++) mazeWalls.push(grid[ii][grid[0].length-1]); // right
    for (let ii = grid[0].length-1; ii > 0; ii--) mazeWalls.push(grid[grid.length-1][ii]); // bottom
    for (let ii = grid.length-1; ii > 0; ii--) mazeWalls.push(grid[ii][0]); // left
}

function divide(grid, row, col, width, height, orientation, mazeWalls) {
    console.log(
        "AT START \n" +
        "row = " + row + "\n" +
        "col = " + col + "\n" +
        "width = " + width + "\n" +
        "height = " + height + "\n"
    )

    if (width < 3 || height < 3)  {
        console.log("maze wall 1 is: ");
        console.log(mazeWalls);
        return mazeWalls;
    }
    
    const isHorizontal = orientation === HORIZONTAL;
    
// rand(3) returns 0,1,2

    //  where will the wall be drawn from?
    let randRow = Math.floor(Math.random() * (height-2)); 
    let randCol = Math.floor(Math.random() * (width-2));

    let newWallRow = row + (isHorizontal ? randRow + 1: 0);
    let newWallCol = col + (isHorizontal ? 0 : randCol + 1);
    
    if (isHorizontal) {
        if (newWallRow%2 === 0 && newWallRow > 0) {
            newWallRow = newWallRow-1;
        }
    } else {
        if (newWallCol%2 === 0 && newWallCol > 0) {
            newWallCol = newWallCol-1;
        }
    }

    console.log("newWallRow is: " + newWallRow);
    console.log("newWallCol is: " + newWallCol);
    
    //    where will the passage through the wall exist?
    let passageRow = newWallRow + (isHorizontal ? 0 : Math.floor(Math.random() * height))
    let passageCol = newWallCol + (isHorizontal ? Math.floor(Math.random() * width) : 0)

    if (isHorizontal) {
        if (passageCol%2 === 1 && passageCol > 0) {
            passageCol = passageCol-1;
        }
    } else {
        if (passageRow%2 === 1 && passageRow > 0) {
            passageRow = passageRow-1;
        }
    }
    
    console.log("pasage x is: " + passageCol);
    console.log("passage y is: " + passageRow);
    
    //    what direction will the wall be drawn?
    let directionRow = isHorizontal ? 0 : 1;
    let directionCol = isHorizontal ? 1 : 0;
    
    //    how long will the wall be?
    let length = isHorizontal ? width : height
    
    console.log("length is: " + length);
    
    //   what direction is perpendicular to the wall?
    let wallDirection = isHorizontal ? 0 : 1
    
    for (let ii = 0; ii < length; ii++) {
        if (newWallCol != passageCol || newWallRow != passageRow) {
            // console.log("In for loop" + "\n" +
            //             "newWallRow is: " + newWallRow + "\n" +
            //             "newWallCol is: " + newWallCol + "\n")
            let node = grid[newWallRow-1][newWallCol-1];
            mazeWalls.push(node);
    
            // console.log("maze wall print 2 = " + mazeWalls.length);
        }
        newWallRow += directionRow;
        newWallCol += directionCol;
    }

    let rect1Row = row;
    let rect1Col = col;
    // let newWidth = isHorizontal ? width : newWallCol-col;
    // let newHeight = isHorizontal ? newWallRow-row-1 : height;
    let newWidth = isHorizontal ? width : newWallCol-col;
    let newHeight = isHorizontal ? newWallRow-row : height;
    divide(grid, rect1Row, rect1Col, newWidth, newHeight, choose_orientation(newWidth, newHeight), mazeWalls);
    // console.log("maze wall print 3 = " + mazeWalls.length);
    
    let rect2Row = isHorizontal ? newWallRow+1 : row;
    let rect2Col = isHorizontal ? col : newWallCol+1;
    // newWidth = isHorizontal ? width : width+col-newWallCol-1;
    // newHeight = isHorizontal ? height-newWallRow+row-1 : height;
    newWidth = isHorizontal ? width : width+col-newWallCol-1;
    newHeight = isHorizontal ? height+row-newWallRow-1 : height;
    divide(grid, rect2Row, rect2Col, newWidth, newHeight, choose_orientation(newWidth, newHeight), mazeWalls);
   
    // return mazeWalls;
}

/**
 * 
 * 
 * 
 * @param {*} width 
 * @param {*} height 
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
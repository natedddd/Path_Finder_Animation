export default function getRecursiveBacktrackMaze(grid, startNode, finishNode) {
    let mazeWalls = setAllNodesAsWall(grid, startNode, finishNode);
    recursivelyDivide(grid, startNode, finishNode);
    mazeWalls = [];
    for (let ii = 0; ii < grid.length; ii++) {
        for (let jj = 0; jj < grid[0].length; jj++) {
            const node = grid[ii][jj];
            if (node.nodeType === "wall-node-maze") {
                node.nodeType = "";
                mazeWalls.push(node);
            }
        }
    }
    // console.log
    return mazeWalls;
}


// function setBorderAsWalls(grid, mazeWalls) {
//     for (let ii = 0; ii < grid[0].length; ii++) mazeWalls.push(grid[0][ii]); // top
//     for (let ii = 0; ii < grid.length; ii++) mazeWalls.push(grid[ii][grid[0].length-1]); // right
//     for (let ii = grid[0].length-1; ii > 0; ii--) mazeWalls.push(grid[grid.length-1][ii]); // bottom
//     for (let ii = grid.length-1; ii > 0; ii--) mazeWalls.push(grid[ii][0]); // left
// }

function setAllNodesAsWall(grid, startNode, finishNode) {
    const mazeWalls = [];
    for (let ii = 0; ii < grid.length; ii++) {
        for (let jj = 0; jj < grid[0].length; jj++) {
            const node = grid[ii][jj];
            // if (node === startNode || node === finishNode) continue;
            node.nodeType = "wall-node-maze";
            mazeWalls.push(node);
        }
    }
    return mazeWalls;
}

function recursivelyDivide(grid, startNode, finishNode) {
    let unvisitedNeighbors = getUnvisitedNeighbors(grid, startNode);
    let stack = [];
    let newGrid = grid.slice();

    if (unvisitedNeighbors.length === 0) return grid;
    shuffle(unvisitedNeighbors);
    stack = stack.concat(unvisitedNeighbors);
    let currentNode = startNode;
    
    while (stack.length != 0) {
        let currentNeighbor = stack.pop();
        newGrid = clearWallBetweenNeighbor(newGrid, currentNode, currentNeighbor);
        
        unvisitedNeighbors = getUnvisitedNeighbors(newGrid, currentNeighbor);
        shuffle(unvisitedNeighbors);
        stack = stack.concat(unvisitedNeighbors);
        currentNode = currentNeighbor;
    }
    // return visitedWalls;
    

    // recursivelyDivide(grid, currentNeighbor, finishNode);
    return newGrid;
}

function getUnvisitedNeighbors(grid, currentNode) {
    const neighbors = [];
    const row = currentNode.row;
    const col = currentNode.col;
    const hasUnvisitedNeighborAbove = row > 1 && grid[row-2][col].nodeType === "wall-node-maze"; 
    const hasUnvisitedNeighborLeft = col > 1 && grid[row][col-2].nodeType === "wall-node-maze"; 
    const hasUnvisitedNeighborBelow = row < grid.length-2 && grid[row+2][col].nodeType === "wall-node-maze";
    const hasUnvisitedNeighborRight = col < grid[0].length-2 && grid[row][col+2].nodeType === "wall-node-maze";

    if (hasUnvisitedNeighborAbove) neighbors.push(grid[row-2][col]);
    if (hasUnvisitedNeighborLeft) neighbors.push(grid[row][col-2]); 
    if (hasUnvisitedNeighborBelow) neighbors.push(grid[row+2][col]);
    if (hasUnvisitedNeighborRight) neighbors.push(grid[row][col+2]); 
    return neighbors;
}

function clearWallBetweenNeighbor(grid, currentNode, neighborNode) {
    const row = currentNode.row;
    const col = currentNode.col
    if (neighborNode.row < row && neighborNode.col === col) {
        grid[row-2][col].nodeType = ""; // above
        grid[row-1][col].nodeType = ""; // between
    }
    if (neighborNode.row === row && neighborNode.col < col) {
        grid[row][col-2].nodeType = ""; // left
        grid[row][col-1].nodeType = ""; // between
    }
    if (neighborNode.row > row && neighborNode.col === col) {
        grid[row+2][col].nodeType = ""; // below
        grid[row+1][col].nodeType = ""; // between
    }
    if (neighborNode.row === row && neighborNode.col > col) {
        grid[row][col+2].nodeType = ""; // right
        grid[row][col+1].nodeType = ""; // between
    }
    return grid;
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
// export default function getRecursiveMaze(grid, startNode, finishNode) {
//     let mazeWalls = setAllNodesAsWall(grid, startNode, finishNode);
//     recursivelyDivide(grid, startNode, finishNode);
//     mazeWalls = [];
//     for (let ii = 0; ii < grid.length; ii++) {
//         for (let jj = 0; jj < grid[0].length; jj++) {
//             const node = grid[ii][jj];
//             if (node.nodeType === "wall-node-maze") {
//                 node.nodeType = "";
//                 mazeWalls.push(node);
//             }
//         }
//     }
//     // console.log
//     return mazeWalls;
// }


// function setBorderAsWalls(grid, mazeWalls) {
//     for (let ii = 0; ii < grid[0].length; ii++) mazeWalls.push(grid[0][ii]); // top
//     for (let ii = 0; ii < grid.length; ii++) mazeWalls.push(grid[ii][grid[0].length-1]); // right
//     for (let ii = grid[0].length-1; ii > 0; ii--) mazeWalls.push(grid[grid.length-1][ii]); // bottom
//     for (let ii = grid.length-1; ii > 0; ii--) mazeWalls.push(grid[ii][0]); // left
// }

// function setAllNodesAsWall(grid, startNode, finishNode) {
//     const mazeWalls = [];
//     for (let ii = 0; ii < grid.length; ii++) {
//         for (let jj = 0; jj < grid[0].length; jj++) {
//             const node = grid[ii][jj];
//             if (node === startNode || node === finishNode) continue;
//             node.nodeType = "wall-node-maze";
//             mazeWalls.push(node);
//         }
//     }
//     return mazeWalls;
// }

// function recursivelyDivide(grid, startNode, finishNode) {
//     let unvisitedNeighbors = getUnvisitedNeighbors(grid, startNode);
//     let stack = [];
//     let newGrid = grid.slice();

//     if (unvisitedNeighbors.length === 0) return grid;
//     shuffle(unvisitedNeighbors);
//     stack = stack.concat(unvisitedNeighbors);
//     let currentNode = startNode;
    
//     while (stack.length != 0) {
//         let currentNeighbor = stack.pop();
//         newGrid = clearWallBetweenNeighbor(newGrid, currentNode, currentNeighbor);
        
//         unvisitedNeighbors = getUnvisitedNeighbors(newGrid, currentNeighbor);
//         shuffle(unvisitedNeighbors);
//         stack = stack.concat(unvisitedNeighbors);
//         currentNode = currentNeighbor;
//     }
//     // return visitedWalls;
    

//     // recursivelyDivide(grid, currentNeighbor, finishNode);
//     return newGrid;
// }

// function getUnvisitedNeighbors(grid, currentNode) {
//     const neighbors = [];
//     const row = currentNode.row;
//     const col = currentNode.col;
//     const hasUnvisitedNeighborAbove = row > 1 && grid[row-2][col].nodeType === "wall-node-maze"; 
//     const hasUnvisitedNeighborLeft = col > 1 && grid[row][col-2].nodeType === "wall-node-maze"; 
//     const hasUnvisitedNeighborBelow = row < grid.length-2 && grid[row+2][col].nodeType === "wall-node-maze";
//     const hasUnvisitedNeighborRight = col < grid[0].length-2 && grid[row][col+2].nodeType === "wall-node-maze";

//     if (hasUnvisitedNeighborAbove) neighbors.push(grid[row-2][col]);
//     if (hasUnvisitedNeighborLeft) neighbors.push(grid[row][col-2]); 
//     if (hasUnvisitedNeighborBelow) neighbors.push(grid[row+2][col]);
//     if (hasUnvisitedNeighborRight) neighbors.push(grid[row][col+2]); 
//     return neighbors;
// }

// function clearWallBetweenNeighbor(grid, currentNode, neighborNode) {
//     const row = currentNode.row;
//     const col = currentNode.col
//     if (neighborNode.row < row && neighborNode.col === col) {
//         grid[row-2][col].nodeType = ""; // above
//         grid[row-1][col].nodeType = ""; // between
//     }
//     if (neighborNode.row === row && neighborNode.col < col) {
//         grid[row][col-2].nodeType = ""; // left
//         grid[row][col-1].nodeType = ""; // between
//     }
//     if (neighborNode.row > row && neighborNode.col === col) {
//         grid[row+2][col].nodeType = ""; // below
//         grid[row+1][col].nodeType = ""; // between
//     }
//     if (neighborNode.row === row && neighborNode.col > col) {
//         grid[row][col+2].nodeType = ""; // right
//         grid[row][col+1].nodeType = ""; // between
//     }
//     return grid;
// }

// function shuffle(array) {
//     let currentIndex = array.length,  randomIndex;
  
//     // While there remain elements to shuffle...
//     while (currentIndex != 0) {
  
//       // Pick a remaining element...
//       randomIndex = Math.floor(Math.random() * currentIndex);
//       currentIndex--;
  
//       // And swap it with the current element.
//       [array[currentIndex], array[randomIndex]] = [
//         array[randomIndex], array[currentIndex]];
//     }
  
//     return array;
//   }
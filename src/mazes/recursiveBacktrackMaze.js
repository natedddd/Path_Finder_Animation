/**
 * Creates a maze generated using recursion. Creates a 
 * path through a grid that is intially all walls
 * 
 * @param {Object[][]<Node>} grid The current grid state
 * @param {Object<Node>} startNode The grid's Start node
 * @param {Object<Node>} finishNode The grid's Finish node
 * @returns {Object[]<Node>} All walls of the maze
 */
export default function getRecursiveBacktrackMaze(grid, startNode) {
    let mazeWalls = setAllNodesAsWall(grid);
    recursivelyDivide(grid, startNode);
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
    return mazeWalls;
}

/**
 * Sets all nodes in the grid as a wall
 * 
 * @param {Object[][]<Node>} grid The current grid state
 * @returns {Object[]<Node>} All nodes in the grid
 */
function setAllNodesAsWall(grid) {
    const mazeWalls = [];
    for (let ii = 0; ii < grid.length; ii++) {
        for (let jj = 0; jj < grid[0].length; jj++) {
            mazeWalls.push( grid[ii][jj].nodeType = "wall-node-maze" );
        }
    }
    return mazeWalls;
}

/**
 * Primary recursive function to generate the paths of the maze.
 * Begins from the 'startNode' and recurses until no more paths remain
 * 
 * @param {Object[][]<Node>} grid The current grid state
 * @param {Object<Node>} startNode The grid's Start node
 * @param {Object<Node>} finishNode The grid's Finish node
 * @returns {Object[][]<Node>} An updated grid 
 */
function recursivelyDivide(grid, startNode) {
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
    return newGrid;
}

/**
 * Returns the unvisited neighbors of 'currentNode'.
 * Note that the neighbors are two nodes away (there is
 * another node between the 'currentNode' and neighbor)
 * 
 * @param {Object[][]<Node>} grid The current grid state
 * @param {Object<Node>} currentNode The current node being considered
 * @returns {Object[]<Node>} An array of neighboring nodes of 'currentNode'
 */
function getUnvisitedNeighbors(grid, currentNode) {
    const row = currentNode.row;
    const col = currentNode.col;
    const neighbors = [];
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

/**
 * Removes the wall between at a given 'neighborNode' and the wall
 * located between the 'neighborNode' and the 'currentNode'.
 * Note, there should always be a wall there, although it is not 
 * a requirement
 * 
 * @param {Object[][]<Node>} grid The current grid state
 * @param {Object<Node>} currentNode The current node being considered
 * @param {Object<Node>} neighborNode One of currentNode's neighbors
 * @returns {Object[][]<Node>} An updated grid 
 */
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

/**
 * Randomly shuffles a given array
 * 
 * Acknowledgement: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 * 
 * @param {Object[]<Nodes>} array An array of nodes
 * @returns {Object[]<Nodes>} The shuffled array
 */
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle
    while (currentIndex != 0) {
  
      // Pick a remaining element
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  }
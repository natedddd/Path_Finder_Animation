import React, { Component } from "react"
import Node from './Node'
import { getNodesInShortestPathOrder, performDijkstra } from "../algorithms/performDijkstra";
import performAStar from "../algorithms/performAStar";

import './PathFindingAnimation.css'

let START_NODE_ROW = 12;
let START_NODE_COL = 10;
let FINISH_NODE_ROW = 12;
let FINISH_NODE_COL = 50;
const NUM_OF_ROWS = 25;
const NUM_OF_COLS = 60;
const ANIMATE_DEFAULT_ALGO_SPEED = 10;
const ANIMATE_PATH_SPEED = 25;
const SLOW_SPD = 15;
const NORMAL_SPD = 1;
const FAST_SPD = 0.4;
/**
 * Creates the object used to provide the grid and visualize the 
 * execution of the selected algorithms. Also handles website controls
 * that clear, select algorithms, generates mazes
 * 
 */
export default class PathFindingAnimation extends Component {
    /**
     * Creates a new PathFindingAnimation with required states
     */
    constructor() {
        super();
        this.state = {
            grid: [],
            mouseIsPressed: false,
            isMovingStart: false,
            isMovingFinish: false,
            isAnimating: false,
            isReadyToAnimate: true,
            currentAlgo: "dijkstra",
            animationSpeed: NORMAL_SPD,
        };
    }

    /**
     * Initializes the empty grid with default Start and
     * Finish node and updates the grid state
     */
    componentDidMount() {
        const grid = createInitialGrid();
        this.setState({grid});
    }

    /**
     * Used to toggled a node to be a wall or back to an empty node.
     * Also sed to set isMovingStart and isMovingFinish boolean states
     * 
     * @param {number} row The row of the node that is currently clicked
     * @param {number} col The col of the node that is currently clicked
     */
    handleMouseDown(row, col) {
        if (this.state.isAnimating) return;
        
        let {movingStart, movingFinish} = this.state;
        if (row === START_NODE_ROW && col === START_NODE_COL) movingStart = true;
        if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) movingFinish = true;
        
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid, mouseIsPressed: true, isMovingStart: movingStart, isMovingFinish: movingFinish});
    }
    
    /**
     * Handles the "dragging" effect of when the mouse toggles walls as
     * the mouse moves through nodes.
     * Also used to move the Start and Finish nodes if they are being dragged
     * 
     * @param {number} row The row of the node that is currently clicked
     * @param {number} col The col of the node that is currently clicked
     */
    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        
        let {isMovingStart, isMovingFinish} = this.state;
        let newGrid;
        if (isMovingStart || isMovingFinish) {
            newGrid = getNewGridWithMovingStartOrEndNode(this.state.grid, row, col, isMovingStart);
        } else {
            newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        }
        this.setState({grid: newGrid});
    }
    
    /**
     * Resets necessary states to false
     */
    handleMouseUp() {
        this.setState({mouseIsPressed: false, isMovingStart: false, isMovingFinish:false})
    }

    /**
     * Animates the nodes in the order they were visited during Dijkstra's
     * algorithm. After reaching the last visited node, calls the function to 
     * animate the shortest path
     * 
     * @param {Object[]<Node>} visitedNodes Contains all visited nodes in the order
     *                                      they were visited from Dijkstra's
     * @param {Object[]<Node>} nodesInShortestPathOrder Contains the shortest path nodes
     *                                                  from Start to Finish node
     */
    animateAlgorithm(visitedNodes, nodesInShortestPathOrder) {
        const {animationSpeed} = this.state;
        for (let ii = 0; ii <= visitedNodes.length; ii++) {
            if (ii === visitedNodes.length) {
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortestPathOrder);
                }, ANIMATE_DEFAULT_ALGO_SPEED * animationSpeed * ii);
            } else {
                setTimeout(() => {
                    const node = visitedNodes[ii];
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
                    document.getElementById(`node-${node.row}-${node.col}`).style.setProperty('--animationSpd',animationSpeed);
                }, ANIMATE_DEFAULT_ALGO_SPEED * animationSpeed * ii);
            }
        }
    }
    
    /**
     * Animates the shortest path from Start to Finish node
     * 
     * @param {Object[]<Node>} nodesInShortestPathOrder Contains the shortest path nodes
     *                                                  from Start to Finish node
     */
    animateShortestPath(nodesInShortestPathOrder) {
        const {animationSpeed} = this.state;
        for (let ii = 0; ii < nodesInShortestPathOrder.length; ii++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[ii];
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path';
            }, ANIMATE_PATH_SPEED * animationSpeed * ii);
        }
        setTimeout(() => {
            this.state.isAnimating = false;
        }, ANIMATE_PATH_SPEED * animationSpeed * nodesInShortestPathOrder.length);
    }

    /**
     * Calls the appropriate algorithm to visualize depending
     * on the 'currentAlgo' state
     */
    visualizeAlgorithm() {
        if (!this.state.isReadyToAnimate) {
            this.handleClearVisitedNodes();
            this.visualizeAlgorithm();
        }
        this.hideDropdown();
        const curAlgo = this.state.currentAlgo;
        this.state.isAnimating = true;
        this.state.isReadyToAnimate = false;
        const {grid} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        let visitedNodes;
        let nodesInShortestPathOrder;
        
        switch (curAlgo) {
            case "dijkstra":
                visitedNodes = performDijkstra(grid, startNode, finishNode);
                nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
                break;
            case "a*":
                console.log("a*");
                visitedNodes = performAStar(grid, startNode, finishNode);
                nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
                break;
            default:
                console.log("Error visualizing algorithms. No valid algorithm select");
                break;
        }
        this.animateAlgorithm(visitedNodes, nodesInShortestPathOrder);
    }
    
    /**
     * Clears only the visited nodes 
     */
    handleClearVisitedNodes() {
        if (this.state.isAnimating) return;
        this.hideDropdown();
        const {grid} = this.state;
        clearVisitedNodes(grid);
        this.setState({grid: grid, isReadyToAnimate: true});
        // this.state.isReadyToAnimate = true;

    }
    
    /**
     * Clears all visited and wall nodes
     */
    handleClearAllNodes() {
        if (this.state.isAnimating) return;
        this.hideDropdown();
        const {grid} = this.state;
        clearAllNodes(grid);
        this.setState({grid: grid});
        this.state.isReadyToAnimate = true;
    }

    /**
     * Updates the algorithm dropdown button with the selected algorithm 
     * and updates the appropriate react state
     * 
     * @param {String} algorithmName The algorithm that was just selected by the user
     */
    updateAlgoDropdownName(algorithmName) {
        document.querySelector('#algoDropdownBtn').textContent = algorithmName;

        if (algorithmName === "Dijkstra's Algorithm") {
            algorithmName = "dijkstra";
        } else {
            algorithmName = "a*";
        }
        // this.handleClearVisitedNodes();
        this.setState({currentAlgo: algorithmName})
    }

    /**
     * Updates the maze dropdown button with the selected maze 
     * and updates the appropriate react state
     * 
     * @param {String} mazeName The algorithm that was just selected by the user
     */
     updateMazeDropdownName(mazeName) {
        document.querySelector('#mazeDropdownBtn').textContent = mazeName;

        // if (algorithmName === "Maze 1") {
        //     algorithmName = "maze1";
        // } else {
        //     algorithmName = "maze2";
        // }
        // this.setState({currentAlgo: algorithmName})
    }

    /**
     * Updates the speed dropdown button with the selected speed 
     * and updates the appropriate react state
     * 
     * @param {String} animationSpeed The algorithm that was just selected by the user
     */
     updateSpeedDropdownName(animationSpeed) {
        document.querySelector('#speedDropdownBtn').textContent = `Speed: ${animationSpeed}`;

        if (animationSpeed === "Slow") {
            animationSpeed = SLOW_SPD;
        } else if (animationSpeed === "Normal") {
            animationSpeed = NORMAL_SPD;
        } else {
            animationSpeed = FAST_SPD;
        }
        this.setState({animationSpeed: animationSpeed})
    }

    /**
     * Hides all dropdown menus
     */
    hideDropdown() {
        let dropdown = document.querySelector('.dropdown.active');
        while (dropdown != null) {
            dropdown.classList.remove('active');
            dropdown = document.querySelector('.dropdown.active');
        }
    }

    /**
     * Sets the algorithm dropdown menu button to be hidden or unhidden
     * 
     * @param {String} dropdownName The dropdown that the user just clicked
     */
    toggleDropdown(dropdownName) {
        const className = `#${dropdownName}`;
        const dropdown = document.querySelector(className);
        dropdown.classList.toggle('active')
    }

    /**
     * Renders the HTML and the grid used for the path finding animation
     * Initializes event handlers 
     */
    render() {
        const {grid, mouseIsPressed} = this.state;
        return (
            <>  
                <div className="header">
                    <div className="navbar">
                        <div className="title">Pathfinding Visualizer</div>
                        <div className="dropdown" id="algoDropdownDiv" onClick={() => this.toggleDropdown("algoDropdownDiv")}>
                            <button className="button" id="algoDropdownBtn">
                                Dijkstra's Algorithm
                            </button>
                            <div className="option" id="algoOptions">
                                <div onClick={() => this.updateAlgoDropdownName("Dijkstra's Algorithm")}>Dijkstra's Algorithm</div>
                                <div onClick={() => this.updateAlgoDropdownName("A* Algorithm")}>A* Algorithm</div>
                            </div>
                        </div>
                        <div className="dropdown" id="mazeDropdownDiv" onClick={() => this.toggleDropdown("mazeDropdownDiv")}>
                            <button className="button" id="mazeDropdownBtn">
                                Maze Options
                            </button>
                            <div className="option" id="mazeOptions">
                                <div onClick={() => this.updateMazeDropdownName("Maze 1")}>Maze 1</div>
                                <div onClick={() => this.updateMazeDropdownName("Maze 2")}>Maze 2</div>
                            </div>
                        </div>
                        <div className="navButton">
                            <button className="button" id="visualizebtn" onClick={() => this.visualizeAlgorithm()}>
                                Visualize!
                            </button>
                        </div>
                        <div className="navButton" >
                            <button className="button" onClick={() => this.handleClearVisitedNodes()}>
                                Clear Visited Nodes
                            </button>
                        </div>
                        <div className="navButton">
                            <button className="button" onClick={() => this.handleClearAllNodes()}>
                                Clear All
                            </button>
                        </div>
                        <div className="dropdown" id="speedDropdownDiv" onClick={() => this.toggleDropdown("speedDropdownDiv")}>
                            <button className="button" id="speedDropdownBtn">
                                Speed: Normal
                            </button>
                            <div className="option" id="speedOptions">
                                <div onClick={() => this.updateSpeedDropdownName("Slow")}>Slow</div>
                                <div onClick={() => this.updateSpeedDropdownName("Normal")}>Normal</div>
                                <div onClick={() => this.updateSpeedDropdownName("Fast")}>Fast</div>
                            </div>
                        </div>
                    </div>
                </div> {/* header */}
                <div className="body"> 
                    <div>
                        Visited Nodes
                        Shortest Path Count
                    </div>
                    <div className="grid">
                        {grid.map((row, rowIdx) => {
                            return (
                                <div key={rowIdx}>
                                    {row.map((node, nodeIdx) => {
                                        const {row, col, nodeType} = node;
                                        return (
                                            <Node
                                                key={nodeIdx}
                                                row = {row}
                                                col = {col}
                                                nodeType = {nodeType}
                                                mouseIsPressed = {mouseIsPressed}
                                                onMouseDown = {(row,col) => this.handleMouseDown(row,col)}
                                                onMouseEnter = {(row,col) => this.handleMouseEnter(row,col)}
                                                onMouseUp = {() => this.handleMouseUp()}
                                            ></Node>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </>
        );
    }
}

/**
 * Creates a node
 * 
 * @param {*} row The row of the node that is currently being created
 * @param {*} col The col of the node that is currently being created
 * @returns {<Node>} Returns the created node
 */
const createNode = (row, col) => {
    return {
        row,
        col,
        nodeType: (row === START_NODE_ROW && col === START_NODE_COL) ? "start-node" 
                : (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) ? "finish-node" 
                : "",
        distance: Infinity,
        heuristicDistance: Infinity,
        isVisited: false,
        previousNode: null,
    };
};

/**
 * Creates a new, empty grid with Start and Finish nodes
 * 
 * @returns {Object[][]<Node>}
 */
const createInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < NUM_OF_ROWS; row++) {
        const currentRow = [];
        for (let col = 0; col < NUM_OF_COLS; col++) {
            currentRow.push(createNode(row,col));
        }
        grid.push(currentRow);
    }
    return grid;
};

/**
 * Returns a new grid after changing a node to a wall, or
 * from a wall back to a empty node.
 * 
 * @param {Object[][]<Node>} grid The current grid state
 * @param {number} row The row of the node that is currently being toggled
 * @param {number} col The col of the node that is currently being toggled
 * @returns {Object[][]<Node>} The new grid with the wall toggled
 */
const getNewGridWithWallToggled = (grid, row, col) => {
    // cannot toggle wall on Start or Finish nodes
    if ( (row === START_NODE_ROW && col === START_NODE_COL) ||
         (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) )  {return grid;}

    const newGrid = grid.slice();
    const tempNode = grid[row][col];

    const newNode = {
        ...tempNode,
        nodeType: tempNode.nodeType === "wall-node" ? "" : "wall-node",
    };
    newGrid[row][col] = newNode;
    
    return newGrid;
}

/**
 * Returns a new grid after changing a node to either the new Start
 * or Finish node, depending on the isMovingStart boolean
 * 
 * @param {Object[][]<Node>} grid The current grid state
 * @param {number} row The row of the node that is currently being set
 * @param {number} col The col of the node that is currently being set
 * @param {Boolean} isMovingStart True iff the user is moving the start node
 * @returns The new grid with the new Start or Finish node
 */
const getNewGridWithMovingStartOrEndNode = (grid, row, col, isMovingStart) => {
    let newGrid = grid.slice();
    const tempNode = grid[row][col];
    let newNode = tempNode;
    
    if (isMovingStart) {
        if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) return newGrid;
        newNode.nodeType = tempNode.nodeType === "start-node" ? "" : "start-node";
        updateStartNodePosition(newGrid, row, col);
    } else {
        if (row === START_NODE_ROW && col === START_NODE_COL) return newGrid;
        newNode.nodeType = tempNode.nodeType === "finish-node" ? "" : "finish-node";
        updateFinishNodePosition(newGrid, row, col);
    }
    newGrid[row][col] = newNode;
    return newGrid;
}

/**
 * Clears all of the visited nodes from the grid
 * 
 * @param {Object[][]<Node>} grid The current grid state
 */
function clearVisitedNodes(grid) {
    for (const row of grid) {
        for (const node of row) {
            const curNodeIsWall = (node.nodeType === "wall-node");
            node.isVisited = false;
            node.distance = Infinity;
            node.heuristicDistance = Infinity;
            node.previousNode = null;
            node.nodeType = (node.row === START_NODE_ROW && node.col === START_NODE_COL) ? "start-node" 
                          : (node.row === FINISH_NODE_ROW && node.col === FINISH_NODE_COL) ? "finish-node" 
                          : "";
            if (curNodeIsWall) node.nodeType = "wall-node";
            document.getElementById(`node-${node.row}-${node.col}`).className = `node ${node.nodeType}`;
        }
    }
}

/**
 * Clears all of the visited and walls nodes from the grid
 * 
 * @param {Object[][]<Node>} grid The current grid state
 */
function clearAllNodes(grid) {
    for (const row of grid) {
        for (const node of row) {
            node.isVisited = false;
            node.distance = Infinity;
            node.previousNode = null;
            node.nodeType = (node.row === START_NODE_ROW && node.col === START_NODE_COL) ? "start-node" 
                          : (node.row === FINISH_NODE_ROW && node.col === FINISH_NODE_COL) ? "finish-node" 
                          : "";
            document.getElementById(`node-${node.row}-${node.col}`).className = `node ${node.nodeType}`;
        }
    }
}

/**
 * Updates the Start node's row and col macros
 * 
 * @param {Object[][]<Node>} grid The current grid state
 * @param {number} row The row of the node that is being updated
 * @param {number} col The col of the node that is being updated
 * @returns {Object[][]<Node>} The new grid state
 */
function updateStartNodePosition(grid, row, col) {
    let node = grid[START_NODE_ROW][START_NODE_COL];
    node.nodeType = "";
    grid[START_NODE_ROW][START_NODE_COL] = node;
    START_NODE_ROW = row;
    START_NODE_COL = col;
    return grid;
}

/**
 * Updates the Finish node's row and col macros
 * 
 * @param {Object[][]<Node>} grid The current grid state
 * @param {number} row The row of the node that is being updated
 * @param {number} col The col of the node that is being updated
 * @returns {Object[][]<Node>} The new grid state
 */
function updateFinishNodePosition(grid, row, col) {
    let node = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    node.nodeType = "";
    grid[FINISH_NODE_ROW][FINISH_NODE_COL] = node;
    FINISH_NODE_ROW = row;
    FINISH_NODE_COL = col;
    return grid;
}
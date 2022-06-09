import React, { Component } from "react"
import Node from './node/Node'
import performDijkstra from "../algorithms/performDijkstra";
import performBiDijkstra from "../algorithms/performBiDijkstra";
import performAStar from "../algorithms/performAStar";
import performGreedy from "../algorithms/performGreedy";
import performRecursiveSearch from "../algorithms/performRecursiveSearch";
import getSnakeMaze from "../mazes/snakeMaze";
import getRandomMaze from "../mazes/randomMaze";
import getRecursiveBacktrackMaze from "../mazes/recursiveBacktrackMaze";
import getRecursiveDivisionMaze from "../mazes/recursiveDivisionMaze";
import { getNodesInShortestPathOrder } from "../algorithms/commonAlgorithmFunctions";

import './PathFindingAnimation.css'

/**** Importing images ****/
import modalImg1 from './imgs/introImg1.png'
import modalImg2 from './imgs/pathfindingImg.jpg'
import modalImg3 from './imgs/algorithmList.png'
import modalImg4 from './imgs/visualizeImg.png'
import draggingClip from './imgs/draggingNodes.mp4'
import draggingPath from './imgs/draggingPath.mp4'

const NUM_OF_GRID_ROWS = 25;
const NUM_OF_GRID_COLS = 59;

/** Row/Col values of important nodes */
let START_NODE_ROW = 12; 
let START_NODE_COL = 10; 
let FINISH_NODE_ROW = 12; 
let FINISH_NODE_COL = 48; 
let DETOUR_NODE_ROW = 5;
let DETOUR_NODE_COL = 29;

/** Speed (SPD) determines animation speed */
const ANIMATE_DEFAULT_ALGO_SPD = 10;
const ANIMATE_PATH_SPD = 25;
const ANIMATE_WALL_SPD = 10;
const SLOW_SPD = 15;
const NORMAL_SPD = 2;
const FAST_SPD = 0.6;

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
            isMovingDetour: false, 
            isReadyToAnimate: true,
            isVisualized: false,
            currentAlgo: "dijkstra",
            animationSpeed: FAST_SPD,
            hasDetour: false,
            currentModalPage: 1,
        };
    }

    /**
     * Initializes the empty grid with default Start and
     * Finish node and updates the grid state
     */
    componentDidMount() {
        const grid = createInitialGrid();
        this.setState({grid});
        console.log("1")
        this.handleDisplayIntroModal();
        console.log("2")
    }

    /**
     * Used to toggled a node to be a wall or back to an empty node.
     * Also sed to set isMovingStart and isMovingFinish boolean states
     * 
     * @param {number} row The row of the node that is currently clicked
     * @param {number} col The col of the node that is currently clicked
     */
    handleMouseDown(row, col) {
        if (!this.state.isReadyToAnimate) return;
        
        let {isMovingStart, isMovingFinish, isMovingDetour} = this.state;

        if (row === START_NODE_ROW && col === START_NODE_COL) isMovingStart = true;
        if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) isMovingFinish = true;
        if (row === DETOUR_NODE_ROW && col === DETOUR_NODE_COL) isMovingDetour= true;
        
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid, 
                       mouseIsPressed: true, 
                       isMovingStart: isMovingStart, 
                       isMovingFinish: isMovingFinish,
                       isMovingDetour: isMovingDetour});
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
        
        let {isMovingStart, isMovingFinish, isMovingDetour} = this.state;
        let newGrid;
        
        if (isMovingStart || isMovingFinish) {
            newGrid = this.getNewGridWithMovingStartOrFinish(this.state.grid, row, col, isMovingStart);
            if (this.state.isVisualized) this.visualizeAlgorithm();
        } else if (isMovingDetour) {
            newGrid = this.getNewGridWithMovingDetour(this.state.grid, row, col);
            if (this.state.isVisualized) this.visualizeAlgorithm();
        } else {
            newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        }
        this.setState({grid: newGrid});
    }
    
    /**
     * Resets necessary states to false
     */
    handleMouseUp() {
        this.setState({mouseIsPressed: false, isMovingStart: false, isMovingFinish:false, isMovingDetour: false})
    }
    
    /**
     * Calls the appropriate algorithm to visualize depending
     * on the 'currentAlgo' state
     */
    visualizeAlgorithm() {
        if (!this.state.isReadyToAnimate) return;
        this.handleClearVisitedNodes();
        this.hideDropdown();
        this.setState({isReadyToAnimate: false});

        const {grid, currentAlgo, isVisualized, hasDetour} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const detourNode = grid[DETOUR_NODE_ROW][DETOUR_NODE_COL];
        let visitedNodes;

        switch (currentAlgo) {
            case "dijkstra":
                visitedNodes = performDijkstra(grid, startNode, finishNode, detourNode, hasDetour);
                break;
            case "bi-dijkstra":
                visitedNodes = performBiDijkstra(grid, startNode, finishNode);
                break;
            case "a*":
                visitedNodes = performAStar(grid, startNode, finishNode, detourNode, hasDetour);
                break;
            case "greedy":
                visitedNodes = performGreedy(grid, startNode, finishNode, detourNode, hasDetour);
                break;
            case "recursiveSearch":
                visitedNodes = performRecursiveSearch(grid, startNode, finishNode, detourNode, hasDetour);
                break;
            default:
                console.log("Error visualizing algorithms. No valid algorithm select");
                break;
        }
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode, detourNode, hasDetour);
        if (isVisualized) {
            this.visualizeAlgorithmNoAnimation(visitedNodes, nodesInShortestPathOrder);
        } else {
            this.animateAlgorithm(visitedNodes, nodesInShortestPathOrder);
        }
        document.querySelector('#visitedCounter').textContent = `Visited Nodes = ${visitedNodes.length}`;
        document.querySelector('#pathCounter').textContent = `Path Nodes = ${nodesInShortestPathOrder.length}`;

        this.setState({isVisualized: true});
    }

    /**
     * Performs the same visualization as normal, but now there is
     * no animation. The "shortest path" is instantly updated.
     * Used when moving 'start' or 'finish' nodes after animating
     * 
     * @param {Object[]<Node>} visitedNodes Contains all visited nodes in the order
     *                                      they were visited from the selected algorithm
     * @param {Object[]<Node>} nodesInShortestPathOrder Contains the shortest path nodes
     *                                                  from Start to Finish node
     */
    visualizeAlgorithmNoAnimation(visitedNodes, nodesInShortestPathOrder) {
        const {hasDetour} = this.state;
        let isAnimatingDetour = hasDetour;
        for (let ii = 0; ii <= visitedNodes.length; ii++) {
            if (ii === visitedNodes.length) {
                for (let ii = 0; ii < nodesInShortestPathOrder.length; ii++) {
                    const node = nodesInShortestPathOrder[ii];
                    if (document.getElementById(`node-${node.row}-${node.col}`).className === 'node node-shortest-path-no-anim') {
                        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path-overlap-no-anim';
                    } else {
                        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path-no-anim'
                    }
                }
            } else {
                const node = visitedNodes[ii];
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited-no-anim';

                if (isAnimatingDetour) {
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited-detour-no-anim';
                    if (node.row === DETOUR_NODE_ROW && node.col === DETOUR_NODE_COL) isAnimatingDetour = false;
                }
            }
        }
        document.getElementById(`node-${START_NODE_ROW}-${START_NODE_COL}`).className = 'node start-node';
        document.getElementById(`node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`).className = 'node finish-node';
        if (hasDetour) document.getElementById(`node-${DETOUR_NODE_ROW}-${DETOUR_NODE_COL}`).className = 'node detour-node';
        this.setState({isReadyToAnimate: true})
    }

    /**
     * Animates the nodes in the order they were visited during the selected
     * algorithm. After reaching the last visited node, calls the function to 
     * animate the shortest path
     * 
     * @param {Object[]<Node>} visitedNodes Contains all visited nodes in the order
     *                                      they were visited from the selected algorithm
     * @param {Object[]<Node>} nodesInShortestPathOrder Contains the shortest path nodes
     *                                                  from Start to Finish node
     */
    animateAlgorithm(visitedNodes, nodesInShortestPathOrder) {
        const {animationSpeed, hasDetour} = this.state;
        let isAnimatingDetour = hasDetour;
        for (let ii = 0; ii <= visitedNodes.length; ii++) {
            if (ii === visitedNodes.length) {
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortestPathOrder);
                }, ANIMATE_DEFAULT_ALGO_SPD * animationSpeed * ii);
            } else {
                
                setTimeout(() => {
                    const node = visitedNodes[ii];
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
                    document.getElementById(`node-${node.row}-${node.col}`).style.setProperty('--animationSpd',animationSpeed);
                    if (isAnimatingDetour) {
                        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited-detour';
                        if (node.row === DETOUR_NODE_ROW && node.col === DETOUR_NODE_COL) isAnimatingDetour = false;
                    } 
                }, ANIMATE_DEFAULT_ALGO_SPD * animationSpeed * ii);
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
        const {animationSpeed, hasDetour} = this.state;
        for (let ii = 0; ii < nodesInShortestPathOrder.length; ii++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[ii];
                if (document.getElementById(`node-${node.row}-${node.col}`).className === 'node node-shortest-path') {
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path-overlap';
                } else {
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path';
                }
            }, ANIMATE_PATH_SPD * animationSpeed * ii);
        }
        setTimeout(() => {
            this.state.isReadyToAnimate = true;
            document.getElementById(`node-${START_NODE_ROW}-${START_NODE_COL}`).className = 'node start-node';
            document.getElementById(`node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`).className = 'node finish-node';
            if (hasDetour) document.getElementById(`node-${DETOUR_NODE_ROW}-${DETOUR_NODE_COL}`).className = 'node detour-node';
            console.log("ready to animate");
        }, ANIMATE_PATH_SPD * animationSpeed * nodesInShortestPathOrder.length);
    }

    /**
     * Animates in the walls of the selected maze
     * 
     * @param {Object[]<Node>} mazeWalls 
     */
    animateMazeWalls(mazeWalls) {
        const {grid, animationSpeed, hasDetour} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const detourNode = grid[DETOUR_NODE_ROW][DETOUR_NODE_COL];
        grid[START_NODE_ROW][START_NODE_COL].nodeType = "start-node";
        grid[FINISH_NODE_ROW][FINISH_NODE_COL].nodeType = "finish-node";

        if (hasDetour) grid[DETOUR_NODE_ROW][DETOUR_NODE_COL].nodeType = "detour-node";

        for (let ii = 0; ii < mazeWalls.length; ii++) {
            const node = mazeWalls[ii];

            setTimeout(() => {
                if (node != startNode && node != finishNode) {
                    if (hasDetour) {
                        if (node != detourNode) {
                            document.getElementById(`node-${node.row}-${node.col}`).className = 'node wall-node-maze';
                            grid[node.row][node.col].nodeType = "wall-node-maze";
                        }
                    } else {
                        document.getElementById(`node-${node.row}-${node.col}`).className = 'node wall-node-maze';
                        grid[node.row][node.col].nodeType = "wall-node-maze";
                    }
                } 
            }, ANIMATE_WALL_SPD * animationSpeed * ii);
        }
        setTimeout(() => {
            this.setState({grid: grid, isReadyToAnimate: true});
        }, ANIMATE_WALL_SPD * animationSpeed * mazeWalls.length);
    }

    /**
     * Handles adding or removing the Detour 
     * node from the grid
     */
    handleDetourBtnClicked() {
        const {hasDetour, currentAlgo} = this.state;
        
        if (currentAlgo === "bi-dijkstra") return;
        console.log(currentAlgo)

        if (hasDetour) {
            this.handleRemoveDetour();
        } else {
            this.handleAddDetour();
        }
    }

    /**
     * Handles adding the Detour node to the grid
     */
    handleAddDetour() {
        let {grid} = this.state;
        let node = grid[DETOUR_NODE_ROW][DETOUR_NODE_COL];
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        while (node === startNode || node === finishNode) {
            DETOUR_NODE_ROW++;
            DETOUR_NODE_COL++
        }
        node = grid[DETOUR_NODE_ROW][DETOUR_NODE_COL];
        grid[DETOUR_NODE_ROW][DETOUR_NODE_COL].nodeType = "detour-node"
        document.querySelector('#detourBtn').textContent = `Remove Detour`;
        this.setState({grid: grid, hasDetour: true})
    }

    /**
     * Handles removing the Detour node from the grid
     */
    handleRemoveDetour() {
        let {grid} = this.state;
        let node = grid[DETOUR_NODE_ROW][DETOUR_NODE_COL];
        node = grid[DETOUR_NODE_ROW][DETOUR_NODE_COL];
        grid[DETOUR_NODE_ROW][DETOUR_NODE_COL].nodeType = ""
        document.querySelector('#detourBtn').textContent = `Add Detour`;
        this.setState({grid: grid, hasDetour: false})
    }
    
    /**
     * Clears only the visited nodes 
     */
    handleClearVisitedNodes() {
        if (!this.state.isReadyToAnimate) return;
        this.hideDropdown();
        const {grid, hasDetour} = this.state;
        clearVisitedNodes(grid, hasDetour);
        this.setState({grid: grid, isReadyToAnimate: true, isVisualized: false});
    }
    
    /**
     * Clears all visited and wall nodes
     */
    handleClearAllNodes() {
        if (!this.state.isReadyToAnimate) return;
        const {grid, hasDetour} = this.state;
        clearAllNodes(grid, hasDetour);
        this.setState({grid: grid, isReadyToAnimate: true, isVisualized: false});
    }

    /**
     * Updates the algorithm dropdown button with the selected algorithm 
     * and updates the appropriate react state
     * 
     * @param {String} algorithmName The algorithm that was just selected by the user
     */
    updateAlgoDropdownName(algorithmName) {
        document.querySelector('#algoDropdownBtn').textContent = algorithmName;

        switch(algorithmName) {
            case "Dijkstra's Algorithm":
                algorithmName = "dijkstra"; 
                break;
            case "Bi-directional Dijkstra's Algorithm":
                algorithmName = "bi-dijkstra"; 
                break;
            case "A* Search":
                algorithmName = "a*"; 
                break;
            case "Greedy Best-First":
                algorithmName = "greedy"; 
                break;
            case "Recursive Search":
                algorithmName = "recursiveSearch"; 
                break;
            default:
                console.log("Error: Invalid algorithm in updateAlgoDropdownName()");
                break;
        }
        // Add because there is no Detour feature for bi-directional Dijkstra
        if (algorithmName === "bi-dijkstra") {
            document.querySelector('#detourBtn').className = "button unavailable";
            this.handleRemoveDetour();
        } else {
            document.querySelector('#detourBtn').className = "button";
        }
        this.setState({currentAlgo: algorithmName});
    }

    /**
     * Updates the maze dropdown button with the selected maze 
     * and updates the appropriate react state
     * 
     * @param {String} mazeName The algorithm that was just selected by the user
     */
     updateMazeDropdownName(mazeName) {
        if (!this.state.isReadyToAnimate) return;
        
        const {grid, hasDetour} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const detourNode = grid[DETOUR_NODE_ROW][DETOUR_NODE_COL];
        this.handleClearAllNodes();
        this.setState({isReadyToAnimate: false});
        let mazeWalls = [];
        
        document.querySelector('#mazeDropdownBtn').textContent = mazeName;
        if (mazeName === "Snake Pattern") {
            mazeWalls = getSnakeMaze(grid, startNode, finishNode, detourNode, hasDetour);
        } else if (mazeName === "Random Maze") {
            mazeWalls = getRandomMaze(grid, startNode, finishNode, detourNode, hasDetour);
        } else if (mazeName === "Recursive Backtrack") {
            mazeWalls = getRecursiveBacktrackMaze(grid, startNode);
        } else {
            mazeWalls = getRecursiveDivisionMaze(grid);
        }
        this.animateMazeWalls(mazeWalls);
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
     * Used to set the 'isVisualized' state to false when 
     * 'Visualized' button is clicked by the user
     */
    handleVisualizeAlgorithm() {
        this.state.isVisualized = false;
        this.visualizeAlgorithm();
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
    getNewGridWithMovingStartOrFinish(grid, row, col, isMovingStart) {
        if ( isStartFinishOrDetourNode(row, col) ) return grid;

        let newGrid = grid.slice();
        const tempNode = grid[row][col];
        const nodeIsWall = (tempNode.nodeType === "wall-node" || 
                            tempNode.nodeType === "wall-node-maze");
        if (nodeIsWall) return newGrid;
        
        if (isMovingStart) {
            tempNode.nodeType = "start-node";
            updateStartNodePosition(newGrid, row, col);
        } else {
            tempNode.nodeType = "finish-node";
            updateFinishNodePosition(newGrid, row, col);
        }
        newGrid[row][col] = tempNode;
        return newGrid;
    }
    
    /**
     * Returns a new grid after changing a node to be the Detour
     * node based on where the user moved it
     * 
     * @param {Object[][]<Node>} grid The current grid state
     * @param {number} row The row of the node that is currently being set
     * @param {number} col The col of the node that is currently being set
     * @returns The new grid with the new Detour node
     */
    getNewGridWithMovingDetour(grid, row, col) {
        if ( isStartFinishOrDetourNode(row, col) ) return grid;

        let newGrid = grid.slice();
        const tempNode = grid[row][col];
        const nodeIsWall = (tempNode.nodeType === "wall-node" || 
                            tempNode.nodeType === "wall-node-maze");
        if (nodeIsWall) return newGrid;
        
        tempNode.nodeType = "detour-node";
        updateDetourNodePosition(newGrid, row, col);
    
        newGrid[row][col] = tempNode;
        return newGrid;
    }

    handleDisplayNextModal() {
        const {currentModalPage} = this.state;
        displayNextModal(currentModalPage+1)

        this.setState({currentModalPage: currentModalPage+1})
    }

    handleDisplayIntroModal() {
        this.setState({currentModalPage: 1});
        displayIntroModal();
        displayNextModal(1)
        console.log(
            "test"
        )
    }

    /**
     * Renders the HTML and the grid used for the path finding animation
     * Initializes event handlers 
     */
    render() {
        console.log("rendering");
        const {grid, mouseIsPressed} = this.state;
        return (
            <>  
                <nav className="header">
                    <div className="navbar">
                        <div className="title">
                            <button className="modal-open-btn" onClick={() => this.handleDisplayIntroModal()}>
                                Pathfinding Visualizer
                            </button>
                        </div>
                        <div className="dropdown large" id="algoDropdownDiv" onClick={() => this.toggleDropdown("algoDropdownDiv")}>
                            <button className="button" id="algoDropdownBtn">
                                    Dijkstra's <br></br>Algorithm
                            </button>
                            <div className="option" id="algoOptions">
                                <div onClick={() => this.updateAlgoDropdownName("Dijkstra's Algorithm")}>Dijkstra's Algorithm</div>
                                <div onClick={() => this.updateAlgoDropdownName("Bi-directional Dijkstra's Algorithm")}>Bi-directional Dijkstra's Algorithm</div>
                                <div onClick={() => this.updateAlgoDropdownName("A* Search")}>A* Search</div>
                                <div onClick={() => this.updateAlgoDropdownName("Greedy Best-First")}>Greedy Best-First</div>
                                <div onClick={() => this.updateAlgoDropdownName("Recursive Search")}>Recursive Search</div>
                            </div>
                        </div>
                        <div className="dropdown large" id="mazeDropdownDiv" onClick={() => this.toggleDropdown("mazeDropdownDiv")}>
                            <button className="button" id="mazeDropdownBtn">
                                Maze Options
                            </button>
                            <div className="option" id="mazeOptions">
                                <div onClick={() => this.updateMazeDropdownName("Snake Pattern")}>Snake Pattern</div>
                                <div onClick={() => this.updateMazeDropdownName("Random Maze")}>Random Maze</div>
                                <div onClick={() => this.updateMazeDropdownName("Recursive Backtrack")}>Recursive Backtrack</div>
                                <div onClick={() => this.updateMazeDropdownName("Recursive Division")}>Recursive Division</div>
                            </div>
                        </div>
                        <div className="navButton">
                            <button className="button" id="detourBtn" onClick={() => this.handleDetourBtnClicked()}>
                                Add Detour
                            </button>
                        </div>
                        <div className="navButton">
                            <button className="button" id="visualizebtn" onClick={() => this.handleVisualizeAlgorithm()}>
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
                                Speed: Fast
                            </button>
                            <div className="option" id="speedOptions">
                                <div onClick={() => this.updateSpeedDropdownName("Slow")}>Slow</div>
                                <div onClick={() => this.updateSpeedDropdownName("Normal")}>Normal</div>
                                <div onClick={() => this.updateSpeedDropdownName("Fast")}>Fast</div>
                            </div>
                        </div>
                        <div className="navButton">
                            <a href="https://github.com/natedddd/Path_Finder_Animation" target="_blank" id="githubBtn">
                                <button className="button">
                                    Visit Github
                                </button>
                            </a>
                        </div>
                    </div>
                </nav> {/* header */}
                
                <div className="body"> 

                    {/**** Grid Visual Guide ****/}
                     <div className="visualizerGuide">
                        <ul className="gridItemsVisual">
                            <li>
                                <div className="guideItem" id="startNodeImg"></div>
                                Start
                            </li>
                            <li>
                                <div className="guideItem" id="finishNodeImg"></div>
                                Finish
                            </li>
                            <li>
                                <div className="guideItem" id="unvisitedNodeImg"></div>
                                Unvisited
                            </li>
                            <li>
                                <div className="guideItem" id="detourNodeImg"></div>
                                Detour
                            </li>
                            <li>
                                <div className="guideItem" id="visitedNodeImg"></div>
                                <div className="guideItem" id="visitedDetourNodeImg"></div>
                                Visited
                            </li>
                            <li>
                                <div className="guideItem" id="shortestPathNodeImg"></div>
                                Shortest-path
                            </li>
                            <li>
                                <div className="guideItem" id="overlapShortestPathNodeImg"></div>
                                Overlapped Shortest-path
                            </li>
                            <li>
                                <div className="guideItem" id="wallNodeImg"></div>
                                Wall
                            </li>
                        </ul>
                    </div>

                    {/**** Counters ****/}
                    <div className="counterWrapper">
                        <div className="counterDiv" id="visitedCounter">
                            Visited Nodes = 0
                        </div>
                        <div className="counterDiv" id="pathCounter">
                            Path Nodes = 0
                        </div>
                    </div> 

                    {/**** Modal ****/}
                    <div className="modal" id="intro-modal">
                        <div className="modal-header">
                            <div id="modal-title">Welcome to Pathfinding Visualizer!</div>
                            <button className="modal-close-btn" onClick={() => this.handleDisplayIntroModal()}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <p className="subtitle" id="modal-subtitle">
                                Welcome to a quick introduction to this website.<br></br>
                            </p>
                            <p id="modal-body-text">
                                This tutorial can always be found by clicking the<br></br>
                                "Pathfinding Visualizer" title in the top left of the screen.<br></br>
                                <br></br>
                                Feel free to skip this intro and start exploring!
                            </p>
                            <img src={modalImg1} id="modal-img"/>
                        </div>
                        <video src={draggingClip} id="modal-vid" width="0" height="0" autoPlay loop></video>
                        <div className="modal-footer">
                            <button className="modal-nav-btn" id="modal-finish-btn" onClick={() => this.handleDisplayIntroModal()}>Show Me Paths!</button>
                            {/* <button className="modal-nav-btn" id="modal-next-btn" onClick={() => handleDisplayNextModal(2)}>Previous</button> */}
                            <p id="modal-progress">1/6</p>
                            <button className="modal-nav-btn" id="modal-next-btn" onClick={() => this.handleDisplayNextModal(2)}>Next, Please!</button>
                        </div>
                    </div>
                    <div id="overlay"></div>


                    {/**** Grid ****/}
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
                    <div>
                        {/* Could be cool to have side by side
                        demos of all algorithms competeing against eachother in gifs
                        below the grid */}
                    </div>
                </div>
            </>
        );
    }
}

function displayIntroModal() {
    const modal = document.querySelector('#intro-modal')
    const overlay = document.querySelector('#overlay')
    
    modal.classList.toggle('active')
    overlay.classList.toggle('active')
}

function displayNextModal(id) {
    const title = document.querySelector('#modal-title');
    const bodySubtitle = document.querySelector('#modal-subtitle');
    const bodyText = document.querySelector('#modal-body-text');
    const bodyImg = document.querySelector('#modal-img')
    const bodyVid = document.querySelector('#modal-vid')
    const nextBtn = document.querySelector('#modal-next-btn')
    const progressCount = document.querySelector('#modal-progress')

    switch(id) {
        case 1:
            console.log("in case 1")
            title.textContent = "Welcome to Pathfinding Visualizer!"
            bodySubtitle.textContent = "Welcome to a quick introduction to this website.\n";
            bodyText.textContent =  "This tutorial can always be found by clicking the \n" + 
                                    "\'Pathfinding Visualizer\' title in the top left of the screen.\n\n" +
                                    "Feel free to skip this intro and start exploring! \n" ;
            bodyImg.src = modalImg1;
            bodyImg.style.width = "80%";
            bodyImg.style.height = "18vw";
            progressCount.textContent = "1/6";
            bodyVid.style.width = "0";
            bodyVid.style.height = "0";
            break;
        case 2:
            title.textContent = "What is Pathfinding?"
            bodySubtitle.textContent = "Pathfinding is the plotting of a route between two\n" +
                                        "points. This application visualizes this process\n" +
                                        "with a variety of different pathfinding algorithms."
            bodyText.textContent =  "All of the algorithms on this site are adapted for a 2D\n" + 
                                    "grid, although they can be applied in many different \n" +
                                    "ways beyond a grid. For this application, each neighbor \n" +
                                    "of a certain \"node\" have a cost of 1 to visit them, so \n" +
                                    "nodes that are farther away are more expensive to visit."
            bodyImg.src = modalImg2;
            bodyImg.style.width = "80%";
            bodyImg.style.height = "18vw";
            progressCount.textContent = "2/6";
            break;
        case 3:
            title.textContent = "How to Get Started"
            bodySubtitle.textContent = "Start by selecting an algorithm from the options.\n" +
                                        "Dijkstra Algorithm is selected by default\n"
            bodyText.textContent =  "These algorithms are all a bit different. Some use no \n" + 
                                    "heurisitcs, while others are very heuristic heavy. \n\n" +
                                    "And some algorithms don't even find the fastest path! \n"
            bodyImg.src = modalImg3;
            bodyImg.style.width = "45%";
            bodyImg.style.height = "20vw";
            progressCount.textContent = "3/6";
            break;
        case 4:
            title.textContent = "Adding Walls and Moving Nodes";
            bodySubtitle.textContent = "Click and drag to add walls. It's that easy!\n" ;
            bodyText.textContent =  "Guess how to move nodes... click and drag? Yes! \n\n"+
                                    "Remove nodes? Click and drag? Wow, you're good. \n";
            bodyImg.style.width = "0";
            bodyImg.style.height = "0";
            bodyVid.src = draggingClip;
            bodyVid.style.width = "100%";
            bodyVid.style.height = "15vw";
            progressCount.textContent = "4/6";
            break;
        case 5:
            title.textContent = "Draggable Start, Finish, and Detour";
            bodySubtitle.textContent = "Click and drag the Start, Finish, or Detour node \n" +
                                        "to instantly see a new path visualized! Neat! \n" ;
            bodyText.textContent =  "This is my favorite feature. It let's you see a new \n"+
                                    "path instantly! Although, the animation is cool too.\n";
            bodyImg.style.width = "0";
            bodyImg.style.height = "0";
            bodyVid.src = draggingPath;
            bodyVid.style.width = "70%";
            bodyVid.style.height = "15vw";
            progressCount.textContent = "5/6";
            break;
        case 6:
            title.textContent = "Thanks! Have Fun Exploring!";
            bodySubtitle.textContent = "Check out the Maze options and don't forget to \n" +
                                        "play with the Detour node! It's cool too. \n" ;
            bodyText.textContent =  "Click the \"Visualize\" button to see the algrithmic action. \n\n" +
                                    "Thanks! That's all folks! \n\n"
            bodyImg.src = modalImg4;
            bodyImg.style.width = "50%";
            bodyImg.style.height = "9vw";
            bodyVid.src = draggingPath;
            bodyVid.style.width = "0";
            bodyVid.style.height = "0";
            progressCount.textContent = "5/6";

            nextBtn.textContent = "Okay, Finish!"
            progressCount.textContent = "6/6";
            break;
        case 7:
            displayIntroModal();
        default:
            console.log("Error in handleDisplayNextModal(). Invalid modal ID");
            break;
    }
}

/**
 * Creates a node
 * 
 * @param {number} row The row of the node that is currently being created
 * @param {number} col The col of the node that is currently being created
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
        isVisitedByFinish: false,
        previousNode: null,
        previousNodeDetour: null,
        nextNode: null, 
    };
};

/**
 * Creates a new, empty grid with Start and Finish nodes
 * 
 * @returns {Object[][]<Node>}
 */
const createInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < NUM_OF_GRID_ROWS; row++) {
        const currentRow = [];
        for (let col = 0; col < NUM_OF_GRID_COLS; col++) {
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
    // Cannot toggle wall on Start or Finish nodes
    if ( isStartFinishOrDetourNode(row, col) )  return grid
    console.log(
        "row is: " + row + " and col is: " + col
    )
    const newGrid = grid.slice();
    const tempNode = grid[row][col];
    const newNode = {
        ...tempNode,
        nodeType: (tempNode.nodeType === "wall-node-maze" || 
                   tempNode.nodeType === "wall-node") ? "" : "wall-node",
    };
    newGrid[row][col] = newNode;
    
    return newGrid;
}


/**
 * Clears all of the visited nodes from the grid
 * 
 * @param {Object[][]<Node>} grid The current grid state
 */
function clearVisitedNodes(grid, hasDetour) {
    for (const row of grid) {
        for (const node of row) {
            const nodeIsWall = (node.nodeType === "wall-node" || 
                                node.nodeType === "wall-node-maze");
            node.isVisited = false;
            node.isVisitedByFinish = false;
            node.distance = Infinity;
            node.heuristicDistance = Infinity;
            node.previousNode = null;
            node.previousNodeDetour = null;
            node.nodeType = (node.row === START_NODE_ROW && node.col === START_NODE_COL) ? "start-node" 
                          : (node.row === FINISH_NODE_ROW && node.col === FINISH_NODE_COL) ? "finish-node" 
                          : (hasDetour && node.row === DETOUR_NODE_ROW && node.col === DETOUR_NODE_COL) ? "detour-node" 
                          : "";
            if (nodeIsWall) node.nodeType = "wall-node";
            document.getElementById(`node-${node.row}-${node.col}`).className = `node ${node.nodeType}`;
        }
    }
}

/**
 * Clears all of the visited and walls nodes from the grid
 * 
 * @param {Object[][]<Node>} grid The current grid state
 */
function clearAllNodes(grid, hasDetour) {
    for (const row of grid) {
        for (const node of row) {
            node.isVisited = false;
            node.isVisitedByFinish = false;
            node.distance = Infinity;
            node.previousNode = null;
            node.previousNodeDetour = null;
            node.nodeType = (node.row === START_NODE_ROW && node.col === START_NODE_COL) ? "start-node" 
                          : (node.row === FINISH_NODE_ROW && node.col === FINISH_NODE_COL) ? "finish-node" 
                          : (hasDetour && node.row === DETOUR_NODE_ROW && node.col === DETOUR_NODE_COL) ? "detour-node" 
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

/**
 * Updates the Detour node's row and col macros
 * 
 * @param {Object[][]<Node>} grid The current grid state
 * @param {number} row The row of the node that is being updated
 * @param {number} col The col of the node that is being updated
 * @returns {Object[][]<Node>} The new grid state
 */
function updateDetourNodePosition(grid, row, col) {
    let node = grid[DETOUR_NODE_ROW][DETOUR_NODE_COL];
    node.nodeType = "";
    grid[DETOUR_NODE_ROW][DETOUR_NODE_COL] = node;
    DETOUR_NODE_ROW = row;
    DETOUR_NODE_COL = col;
    return grid;
}

/**
 * Checks if the given row and col correspond to a Start, Finish, or Detour node
 * 
 * @param {number} row 
 * @param {number} col 
 * @returns True if the row & col corresponds to a Start, Finish, or Detour node
 */
function isStartFinishOrDetourNode(row, col) {
    if ( (row === START_NODE_ROW && col === START_NODE_COL) ||
         (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) ||
         (row === DETOUR_NODE_ROW && col === DETOUR_NODE_COL) ) return true;
    return false;
}
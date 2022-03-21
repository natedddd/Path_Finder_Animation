import React, { Component } from "react"
import Node from './Node'
import { getNodesInShortestPathOrder, dijkstra } from "../algorithms/dijkstra";

import './PathFindingAnimation.css'

const START_NODE_ROW = 1;
const START_NODE_COL = 1;
const FINISH_NODE_ROW = 18;
const FINISH_NODE_COL = 48;
const NUM_OF_ROWS = 20;
const NUM_OF_COLS = 50;

export default class PathFindingAnimation extends Component {
    constructor() {
        super();
        this.state = {
            grid: [],
            mouseIsPressed: false,
        };
    }

    componentDidMount() {
        const grid = createInitialGrid();
        this.setState({grid});
    }

    handleMouseDown(row, col) {
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid, mouseIsPressed: true});
    }

    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid});
    }

    handleMouseUp() {
        this.setState({mouseIsPressed: false})
    }

    animateAlgorithm(visitedNodes, nodesInShortestPathOrder) {
        for (let ii = 0; ii <= visitedNodes.length; ii++) {
            if (ii === visitedNodes.length) {
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortestPathOrder);
                }, 10 * ii);
            } else {
                setTimeout(() => {
                    const node = visitedNodes[ii];
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
                }, 10 * ii);
            }
        }
    }

    animateShortestPath(nodesInShortestPathOrder) {
        for (let ii = 0; ii < nodesInShortestPathOrder.length; ii++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[ii];
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path';
            }, 25 * ii);
        }
    }

    visualizeDijkstra() {
        const {grid} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodes = dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        this.animateAlgorithm(visitedNodes, nodesInShortestPathOrder);
    }
    
    handleClearVisitedNodes() {
        const {grid} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodes = dijkstra(grid, startNode, finishNode);
        const newGrid = clearVisitedNodes(grid, visitedNodes);
        this.setState({grid: newGrid});
    }
    
    handleClearAllNodes() {
        const {grid} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodes = dijkstra(grid, startNode, finishNode);
        const newGrid = clearAllNodes(grid, visitedNodes);
        this.setState({grid: newGrid});
    }

    render() {
        const {grid, mouseIsPressed} = this.state;

        return (
            <>
                <button onClick={() => this.visualizeDijkstra()}>
                    Visualize!
                </button>
                <button onClick={() => this.handleClearVisitedNodes()}>
                    Clear Visited Nodes
                </button>
                <button onClick={() => this.handleClearAllNodes()}>
                    Clear All
                </button>
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
            </>
        );
    }
}


const createNode = (row, col) => {
    return {
        row,
        col,
        nodeType: (row === START_NODE_ROW && col === START_NODE_COL) ? "start-node" 
                : (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) ? "finish-node" 
                : "",
        distance: Infinity,
        isVisited: false,
        // isWall: false,
        previousNode: null,
    };
};

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

const getNewGridWithWallToggled = (grid, row, col) => {
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

const clearVisitedNodes = (grid, visitedNodes) => {
    for (const row of grid) {
        for (const node of row) {
            const isWall = (node.nodeType === "wall-node");
            node.isVisited = false;
            node.distance = Infinity;
            node.previousNode = null;
            node.nodeType = (node.row === START_NODE_ROW && node.col === START_NODE_COL) ? "start-node" 
                            : (node.row === FINISH_NODE_ROW && node.col === FINISH_NODE_COL) ? "finish-node" 
                            : "";
            if (isWall) node.nodeType = "wall-node";
            document.getElementById(`node-${node.row}-${node.col}`).className = `node ${node.nodeType}`;
        }

    }
    return grid;
}

const clearAllNodes = (grid, visitedNodes) => {
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
    return grid;
}

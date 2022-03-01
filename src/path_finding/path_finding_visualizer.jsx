import React, { Component } from "react"
import Node from './node'

import './path_finding_visualizer.css'

const NUM_OF_ROWS = 20;
const NUM_OF_COLS = 50;
const START_ROW = 10;
const START_COL = 10;
const FINISH_ROW = 10;
const FINISH_COL = 30;



export default class Path_Findering_Visualizer extends Component {

    constructor() {
        super();
        this.state = {
            grid: [],
        };
    }

    componentDidMount() {
        const grid = createGrid();

        this.setState({grid});
    }

    render() {
        const {grid} = this.state;

        return (
            <>
            <button>
                Visualize!
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
        nodeType: (row === START_ROW && col === START_COL) ? "start-node" 
                : (row === FINISH_ROW && col === FINISH_COL) ? "finish-node" 
                : "",

    };
};

const createGrid = () => {
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
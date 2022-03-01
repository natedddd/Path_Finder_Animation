import React, { Component } from "react";

import './node.css'

export default class Node extends Component {
    render() {
        const {
            row,
            col,
            nodeType,
        } = this.props;

        return (
            <div className={`node ${nodeType}`}>
              
            </div>
        
        );
    }
}
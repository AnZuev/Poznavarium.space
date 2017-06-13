'use strict';
import * as React from 'react';

export class LeftSideBarTag extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            value: props.value,
            counter: props.counter
        };
        this.etc = {
            leftSideBar: props.leftSideBar
        };

        this.onClickHandler = this.onClickHandler.bind(this);
    }
    onClickHandler(){
        this.etc.leftSideBar.tagClicked(this.state.value);
    }

    render(){
        return (
            <li onClick={this.onClickHandler}>
                <span className="leftSideBar__tagTitle">{this.state.value}</span>
                <span className="leftSideBar__tagCounter pullRight">{this.state.counter}</span>
            </li>)

    }

}
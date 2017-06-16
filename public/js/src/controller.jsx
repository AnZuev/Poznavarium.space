'use strict';
import * as React from 'react';
import {NeedMoreVideosButton} from "./NeedMoreVideosButton.jsx";

export class Controller extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            state: "new"
        };

        this.handleAllClick = this.handleAllClick.bind(this);
        this.handleNewClick = this.handleNewClick.bind(this);
    }

    getState(){
        return this.state.state
    }

    handleNewClick(){
        if(this.state.state === "new"){
            return;
        }
        this.props.root.changeVideoListType("new");
        this.setState({
            state: "new"
        });
        console.log("new");

    }

    handleAllClick(){
        if(this.state.state === "all"){
            return;
        }
        this.props.root.changeVideoListType("all");
        this.setState({
            state: "all"
        });
        console.log("all");
    }

    showAndHighlightSearchTab(){
        this.setState({
            state: "search"
        })
    }
    render(){
        let tabs;
        if(this.state.state === "new"){
            tabs = [
                (<span className="content__topMenuItem content__topMenuItemChoosen" onClick={this.handleNewClick}>Новое</span>),
                (<span className="content__topMenuItem" onClick={this.handleAllClick}>Все фильмы</span>)
            ]
        }else if(this.state.state === "all"){
            tabs = [
                (<span className="content__topMenuItem" onClick={this.handleNewClick}>Новое</span>),
                (<span className="content__topMenuItem content__topMenuItemChoosen" onClick={this.handleAllClick}>Все фильмы</span>)
            ]
        }else{
            tabs = [
                (<span className="content__topMenuItem" onClick={this.handleNewClick}>Новое</span>),
                (<span className="content__topMenuItem" onClick={this.handleAllClick}>Все фильмы</span>),
                (<span className="content__topMenuItem content__topMenuItemChoosen">Поиск</span>)
            ]
        }
        return (
            <p className="content__topMenu">
                {tabs}
                <NeedMoreVideosButton />
            </p>
        )
    }

}
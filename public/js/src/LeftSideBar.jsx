'use strict';
import * as React from 'react';
import {LeftSideBarTag} from "./LeftSideBarTag.jsx"

export class LeftSideBar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            tags: this.props.tags
        };
        this.etc = {
            root: window.videoPageContent
        };
    }

    tagClicked(tag){
        videoPageContent.tools.videoListComponent.initTagSearch(tag);
    }
    render(){
        let lis = [];
        this.state.tags.forEach((tag)=>{
            lis.push(<LeftSideBarTag
                    value = {tag.tag}
                    counter = {tag.counter}
                    leftSideBar = {this}
            />)
        });

        return(
            <div>
                <p className="leftSideBar__title">Познавариум</p>
                <ul className="leftSideBar__tags">
                    {lis}
                </ul>
            </div>
        )
    }

}
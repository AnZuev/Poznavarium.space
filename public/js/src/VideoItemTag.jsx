'use strict';
import * as React from 'react';

export class VideoItemTag extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            value: props.value
        };
        this.etc = {
            videoItem: props.videoItem
        };

        this.onClickHandler = this.onClickHandler.bind(this);
    }
    onClickHandler(){
        this.etc.videoItem.tagClicked(this.state.value);
        console.log("Tag clicked")
    }

    render(){
        return (<span className="videosItem__tags__tag" onClick={this.onClickHandler}>{this.state.value}</span>)
    }

}
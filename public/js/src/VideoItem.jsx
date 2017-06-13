'use strict';
import * as React from 'react';
import {VideoItemTag} from "./VideoItemTag"

export class VideoItem extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            url: props.url,
            thumbnail: props.thumbnail,
            title: props.title,
            tags: props.tags
        };
        this.etc = {
            videoList: props.videoList
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e){
        if(e.target.className !== "videosItem__tags__tag"){
            window.open(this.state.url, '_blank')
        }
    }
    tagClicked(tag){
        this.etc.videoList.initTagSearch(tag);
    }

    render(){
        let tags = [];
        this.state.tags.forEach((tag)=>{
            tags.push (<VideoItemTag key={tag}
                                     value={tag}
                                     videoItem={this}/>)
        });

        return(
            <div className="videoItem" onClick={this.handleClick}>
                <p className="videoItem__title">{this.state.title}</p>
                <img className ='videoItem__img' src={this.state.thumbnail} alt=""/>
                <p className="videoItem__tags">
                    {tags}
                </p>
            </div>
        )
    }
}
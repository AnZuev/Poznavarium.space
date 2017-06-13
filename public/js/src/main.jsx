'use strict';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {VideosList} from './VideosList.jsx'
import {Controller} from "./controller.jsx"
import {LeftSideBar} from "./LeftSideBar.jsx"

class VideoPageContent extends React.Component{
    constructor(props){
        super(props);
        window.videoPageContent = this;
        this.props = {
            videoListComponent: "",
            videoControllerComponent: ""
        };
        this.state = {
            type: 'new',
            isSearchEnabled: false
        };

        this.tools = {}
    }

    initSearch(){
        this.tools.videoControllerComponent.showAndHighlightSearchTab();
    }

    changeVideoListType(type){
        this.tools.videoListComponent.setType(type);
    }

    render(){
        let setVideoListComponent = (videoListComponent)=>{
            this.tools.videoListComponent = videoListComponent;
        };
        let setVideoControllerComponent = (videoControllerComponent)=>{
            this.tools.videoControllerComponent = videoControllerComponent;
        };
        return(
            <div>
                <Controller videoPageContent={this}
                            ref={setVideoControllerComponent}
                            root = {this}
                            isSearchEnabled = {this.state.isSearchEnabled}
                />
                <VideosList videoPageContent={this}
                            videos={this.props.videos}
                            type="new"
                            ref = {setVideoListComponent}
                            root = {this}
                />
            </div>
        )
    }
}


ReactDOM.render(<VideoPageContent videos = {window.data.videos} type = 'new'/>, document.getElementById('content'));
ReactDOM.render(<LeftSideBar tags = {window.data.tags} />, document.getElementById('leftSideBar'));



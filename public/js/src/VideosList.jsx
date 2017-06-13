'use strict';
import * as React from 'react';
import {VideoItem} from './VideoItem.jsx'

export class VideosList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            videos: props.videos || [],
            canLoadMoreVideos: true,
            noVideosToShow: false
        };
        if(this.state.videos.length === 0)
            this.loadVideos();

        this.etc = {
            skip: 1,
            prevType: props.type,
            type: props.type, //could be new or all, need to use in load videos method
            noVideos: false,
            root: props.root
        };
        this.handleLoadMoreClick = this.handleLoadMoreClick.bind(this);

    }
    setType(type){
        this.etc.prevType = this.etc.type;
        this.etc.type = type;
        this.loadVideos()
    }


    loadVideos(url){
        url = url || "";
        if(url.length === 0){
            if(this.etc.type === "new"){
                if( this.etc.prevType !== this.etc.type)
                    this.etc.skip = 0;
                url = '/api/videos/get/unwatched/' + this.etc.skip;
            }else{
                if( this.etc.prevType !== this.etc.type)
                    this.etc.skip = 0;

                url = '/api/videos/get/all/' + this.etc.skip;
            }
            this.etc.skip = this.etc.skip + 1;
        }else{
            url = url + this.etc.tag.skip;
            this.etc.tag.skip = this.etc.tag.skip + 1;
        }

        fetch(url, {
            method: 'get',
        }).then((response)=>{
            if(response.status === 200){
                this.etc.noVideos = false;
                return response.json();
            }else if(response.status === 204){
                console.log("No videos loaded");
                this.etc.noVideos = true;
                return [];
            }else{
                alert("Some error occuried while loading videos");
                throw new Error("Some error occuried while loading videos");
            }
        }).then((videos) => {
            if( this.etc.prevType !== this.etc.type){
                this.setState({
                    videos: videos,
                    noVideosToShow: this.etc.noVideos,
                    canLoadMoreVideos: !this.etc.noVideos
                });
                this.etc.prevType = this.etc.type;
            }else
                if(this.etc.noVideos){
                    this.setState({
                        noVideosToShow: false,
                        canLoadMoreVideos: !this.etc.noVideos
                    })
                }else{
                    if(this.etc.tag.tagHasChanged){
                        this.setState({
                            videos: videos,
                            noVideosToShow: false,
                            canLoadMoreVideos: !this.etc.noVideos
                        })
                    }
                    this.setState({
                        videos: this.state.videos.concat(videos),
                        noVideosToShow: false,
                        canLoadMoreVideos: !this.etc.noVideos
                    })
                }


        })

    }

    handleLoadMoreClick(){
        this.loadVideos();
    }

    initTagSearch(tag){
        //logic

        if(this.etc.tag && this.etc.tag.value === tag){
            return;
        }else{
            this.etc.tag = {
                skip: 0,
                value: tag,
                tagHasChanged: true
            }
        }
        let url = `/api/videos/get/${tag}/`;
        this.etc.prevType = this.etc.type;
        this.etc.type = "tagSearch";
        this.loadVideos(url, this.etc.tag.skip);
        this.etc.root.initSearch();
    }

    render(){
        let block = [];
        if(this.state.noVideosToShow){
            block = (<p className="NoVideosLoadedErrorMessage">Хмм, кажется, пока нет видео. Попробуй позже :)</p>)
        }else{
            this.state.videos.forEach((video)=>{
                block.push(<VideoItem
                    url = {video.url}
                    thumbnail = {video.thumbnail}
                    tags = {video.tags}
                    title = {video.title}
                    key = {video._id}
                    videoList = {this}
                />)
            });
        }
        let button;
        if(this.state.canLoadMoreVideos){
            button = (<p className="content__videosLoadMoreButton" onClick={this.handleLoadMoreClick}>Загрузить еще</p>)
        }
        return(
            <div>
                {block}
                {button}
            </div>
        )
    }
}
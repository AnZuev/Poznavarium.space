'use strict';
import * as React from 'react';

export class NeedMoreVideosButton extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            clicked: false,
            opacity: 1
        };
        this.etc = {
            url: "/api/etc/needMoreVideos"
        };

        this.onClickHandler = this.onClickHandler.bind(this);
    }
    onClickHandler(){
        fetch(this.etc.url, {
            method: 'post',
        }).then((response)=>{
            if(response.status === 200){
                this.setState({opacity: 1, clicked: true}, () => {
                    if (!this.timeout)
                        clearTimeout(this.timeout);
                    this.timeout = setTimeout(() => this.setState({opacity: 0}), 2000)
                })
            }else{
                alert("Something bad happened");
            }
        });

    }

    render(){
        if(this.state.clicked){
            return (<span
                style={{opacity: this.state.opacity, transition: "opacity 1s"}}
                className="content__topMenuItem pullRight success"
                onClick={this.onClickHandler}>Я отправила сообщение Антону :)</span>)
        }else{
            return (<span className="content__topMenuItem pullRight" onClick={this.onClickHandler}>Хочу больше видео!</span>)
        }
    }

}
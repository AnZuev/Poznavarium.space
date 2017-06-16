'use strict';

const router = require('koa-router')();
const _ = require("underscore");
const ResourceItem = ModelRegister.getModel("ResourceItem");
const {Telegram} = require("telegraf");
const telegram = new Telegram(process.env.telegramBotToken, {});

// get index page
router.get("/", async (ctx, next) => {
        let videos = await ResourceItem.getUnwatchedVideos({});
        let tags = await ResourceItem.getAllTags({});
        console.log(tags);

        _.map(videos, (video) => {
            video.thumbnail = LibraryFunctions.getYoutubeThumbnail(video.url).url;
        });

        if(videos.length  === 0){
            ctx.status = 204;
        }else{
            ctx.status= 200;
        }

        await ctx.render('index', {
            videos: JSON.stringify(videos),
            tags: JSON.stringify(tags)
        });
});

// get all videos
router.get('/api/videos/get/all/:skip', async (ctx, next) => {
        let skip = Number.parseInt(ctx.params.skip) || 0;
        let videos = await ResourceItem.getAllVideos({skip: skip});

        _.map(videos, (video) => {
            video.thumbnail = LibraryFunctions.getYoutubeThumbnail(video.url).url;
        });
        if(videos.length  === 0){
            ctx.status = 204;
        }else{
            ctx.status= 200;
        }
        //ctx.status = 204;
        ctx.body = videos;
});

// get new videos(optional: by tags)
router.get("/api/videos/get/unwatched/:skip", async (ctx, next) => {
        let skip = Number.parseInt(ctx.params.skip) || 0;
        let videos = await ResourceItem.getUnwatchedVideos({skip: skip});

        _.map(videos, (video) => {
            video.thumbnail = LibraryFunctions.getYoutubeThumbnail(video.url).url;
        });

        if(videos.length  === 0){
            ctx.status = 204;
        }else{
            ctx.status= 200;
        }

        ctx.body = videos;
});

// get videos by tags ,
// tags has to be joined by ','
router.get("/api/videos/get/:tags/:skip", async (ctx, next) => {
        let tags = ctx.params.tags.split(",");
        let skip = Number.parseInt(ctx.params.skip) || 0;
        let videos = await ResourceItem.getVideosByTags({skip: skip, tags: tags});

        _.map(videos, (video) => {
            video.thumbnail = LibraryFunctions.getYoutubeThumbnail(video.url).url
        });
        if(videos.length  === 0){
            ctx.status = 204;
        }else{
            ctx.status= 200;
        }

        ctx.body = videos;
        await next;
});

router.post("/api/etc/needMoreVideos", async (ctx) => {
    let chatId = require('config').botAvailableFor[0];
    telegram.sendMessage(chatId, "Hi! I want you to add new videos");
    ctx.status = 200;
});

module.exports = router;
"use strict";

const Telegraf = require('telegraf');
const Extra = Telegraf.Extra;
const Markup = Telegraf.Markup;
const config = require("config.json");
const _ = require("underscore");


let sessionData = {
    data: {
        add:{}
    },
    type: ""
};
/**
 *
 * @param bot{Telegraf}
 */
module.exports = (bot)=>{
    bot.use((ctx, next) =>{
        let from = (ctx.update.message || ctx.update.callback_query).from;

        if(config.botAvailableFor.indexOf(from.id) >= 0){
            return next();
        }else{
            ctx.reply("Sorry, you don't have access to modify poznavarium.space :)")
        }
    });
    bot.command('/start', ({ reply }) => {
        return reply('Бот для управления poznavarium.space',
            Markup.inlineKeyboard([
                Markup.callbackButton('Add ', 'add:url'),
                Markup.callbackButton('Remove', 'remove'),
                Markup.callbackButton('All', 'getAll'),
                Markup.callbackButton('Stats', 'getStats'),
            ]).extra());
    });

    bot.action('add:url', (ctx, next) => {
        sessionData.type = "add:waitForUrl";
        return ctx.reply('Provide url to the youtube video').then(next)
    });

    bot.on("message", (ctx) =>{
        console.log(sessionData);
        switch (sessionData.type){
            case "add:waitForUrl":
                sessionData.data.add = {
                    url: ctx.update.message.text
                };
                sessionData.type = "add:waitForTitle";
                return ctx.reply('Provide title for the video');
            case "add:waitForTitle":
                sessionData.data.add.title = ctx.update.message.text;
                sessionData.type = "add:waitForTags";
                return ctx.reply('Provide tags for the video(must be separated by ","')
            case "add:waitForTags":
                let tags = (ctx.update.message.text || "")
                    .replace(/\s+/g, '')
                    .split(",");
                sessionData.data.add.tags = [];
                _.forEach(tags, (tag) =>{
                    sessionData.data.add.tags.push(tag.capitalize());
                });
                sessionData.type = "add:confirm";
                return ctx.reply(
                    `Check that everything is correct:\n
                    title: ${sessionData.data.add.title},\n
                    url: ${sessionData.data.add.url},\n
                    tags: ${sessionData.data.add.tags.join(", ")}
                    `,
                    Markup.inlineKeyboard([
                        Markup.callbackButton('Save', 'add:save'),
                        Markup.callbackButton('Cancel', 'add:cancel')
                    ]).extra());
                break;
            default:
                sessionData.data.add = {};
                sessionData.type = "";
                return ctx.reply('Бот для управления poznavarium.space',
                    Markup.inlineKeyboard([
                        Markup.callbackButton('Add ', 'add:url'),
                        Markup.callbackButton('Remove', 'remove'),
                        Markup.callbackButton('All', 'getAll'),
                        Markup.callbackButton('Stats', 'getStats'),
                    ]).extra());

        }
    });

    bot.action("add:save", async (ctx) => {
        let res = await ModelRegister.getModel("ResourceItem")
            .create(sessionData.data.add.title,
                sessionData.data.add.url,
                sessionData.data.add.tags);
        sessionData.data.add = {};
        sessionData.type = "";
        await ctx.reply(`Video successfully added, id = ${res._id}`);
    });
    bot.action("add:cancel", async (ctx) => {
        sessionData.data.add = {};
        sessionData.type = "";
        await ctx.reply('Adding has been canceled',
            Markup.inlineKeyboard([
                Markup.callbackButton('Add ', 'add:url'),
                Markup.callbackButton('Remove', 'remove'),
                Markup.callbackButton('All', 'getAll'),
                Markup.callbackButton('Stats', 'getStats'),
            ]).extra());
    });


    bot.action('remove', (ctx, next) => {
        return ctx.reply("removeGot").then(next)
    })
}
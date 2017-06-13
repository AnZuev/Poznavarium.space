"use strict";

// common settings
global.basePath = __dirname;
require("etc/logger.js");

global.ModelRegister = require("models/ModelsRegister.js");
global.LibraryFunctions = require('etc/LibraryFunctions.js');







// importing modules
const config = require("config.json");

// initializing web app
const Koa = require('koa');
const app = new Koa();
const serve = require('koa-static');
const path = require('path');
const hbs = require('koa-hbs-renderer');

app.use(hbs({
    paths: {
        views:  __dirname + '/views'
    }
}));

require("routes/index.js")(app);


app.use(serve(path.join(__dirname + '/public')));



app.listen(config.general.port, function () {
    log.info("Server is listening on port %d", config.general.port);
});


// initializing telegramBot interface

const Telegraf = require('telegraf');

const bot = new Telegraf(process.env.telegramBotToken);
require('telegramBot/index.js')(bot);
bot.startPolling();

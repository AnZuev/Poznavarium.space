'use strict';

const Log4js = require("log4js");
const config = require("config.json");
const _ = require("underscore");
const Path = require("path");



Log4js.loadAppender('file');
_.each(config.logger.appenders, (item)=>{
    Log4js.addAppender(Log4js.appenders.file(Path.join(basePath, 'logs', item.filename)), 'default');
});


let logger = Log4js.getLogger("default");

global.log = logger;

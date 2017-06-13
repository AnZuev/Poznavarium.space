'use strict';

const fs = require('fs');
const Path = require("path");


/*
 * This module is used for parsing all routes files from routes directory
 * and adding them to app
 * All routes files has to export router object
 */
module.exports = function (app) {
    log.debug("Initializing router...");
    let files = fs.readdirSync(__dirname);
    files.forEach(fileName => {
        if(fileName === __filename.split("/").pop()) return;
        let router = require(Path.join(__dirname, fileName));
        log.debug("...... Adding %s file", fileName);
        app.use(router.routes());
    });

    log.debug("Router has been initialized");
};


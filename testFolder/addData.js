"use strict";

// common settings
global.basePath = __dirname;
require("etc/logger.js");
let _ = require('underscore');

global.ModelRegister = require("models/ModelsRegister.js");
global.LibraryFunctions = require('etc/LibraryFunctions.js');

let source = require("./source.json");


let ResourceItem = ModelRegister.getModel("ResourceItem");

_.forEach(source.videos, async (item) => {
    let result = await ResourceItem.create(item.title, item.url, item.tags);
    console.log(result);
})

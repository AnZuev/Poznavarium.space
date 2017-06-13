'use strict';
const Mongoose = require("mongoose");
const Path = require("path");
const config = require("config.json");
const Util = require("util");
const fs = require('fs');



class ModelsRegister{

    static init(){

        let modelFiles = ModelsRegister.getModelFiles();
        ModelsRegister.createConnection();
        ModelsRegister.register = {};
        log.debug("Model initializing started:");
        modelFiles.forEach(modelName => {
            if(modelName === __filename.split('/').pop()) return;
            let model = require(Path.join(__dirname, modelName));
            log.debug("...... Adding model %s to the register", modelName);
            ModelsRegister.register[modelName.split('.')[0]] = ModelsRegister.connection.model(modelName.split('.')[0], model);
        });
        log.debug("Model initializing has finished");
    }

    static getModelFiles(){
        return fs.readdirSync(__dirname);
    }

    static getConnectionString(){
        let db = config.database;
        return Util.format("mongodb://%s:%s@%s:%s/%s", db.databaseUser, db.databasePassword, db.host, db.port, db.databaseName);
    }

    //mongodb://user:pass@localhost:port/database
    static createConnection(){
        ModelsRegister.connection = Mongoose.createConnection(ModelsRegister.getConnectionString());
    }

    static getModel(modelName){
        return ModelsRegister.register[modelName] || null;
    }

}

ModelsRegister.init();
module.exports = ModelsRegister;
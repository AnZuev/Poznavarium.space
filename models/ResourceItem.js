'use strict';
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Util = require("util");
const _ = require("underscore");
const config = require("config.json");

/**
 * @class ResourceItem
 */
let ResourceItem = new Schema({
   url:{
       type:String,
       required: false,
       unique: true
   },
    tags:[String],
    created:{
        type: Date,
        default: Date.now()
    },
    rating:[Number],
    title: {
        type: String,
        required: true
    },
    watchedBy: [
        {
            type: Schema.Types.ObjectId,
            required: true
        }
    ]
});



/**
 * addTags
 * @memberof ResourceItem
 * @instance
 * @param tags
 * @returns {*|Promise}
 */
ResourceItem.methods.addTags = function (tags) {

    //join two sets of tags, keep only unique ones
    this.tags = _.union(this.tags, tags);
    return this.save();
};


/**
 * removeTags
 * @memberof ResourceItem
 * @instance
 * @param tags
 * @returns {*|Promise}
 */
ResourceItem.methods.removeTags = function (tags) {

    //substruct from this.tags tags
    this.tags = _.difference(this.tags, tags);
    return this.save()
};

/**
 * addRating
 * @memberof ResourceItem
 * @instance
 * @param ratingInstance
 * @returns {*|Promise}
 */
ResourceItem.methods.addRating = function (ratingInstance) {
    ratingInstance = Number.parseInt(ratingInstance);
    if(ratingInstance <= 0 && ratingInstance > 5){
        throw new Exception(Util.format("Rating must be between 0 and 5, got %d", ratingInstance))
    }
    this.rating.add(ratingInstance);
    return this.save();
};

/**
 * watchVideo
 * @memberof ResourceItem
 * @instance
 * @param userId
 * @returns {Promise|*}
 */
ResourceItem.methods.watchVideo = function (userId) {
    let newWatchedBy = _.join(this.watchedBy, [userId]);
    if(this.watchedBy.length !== newWatchedBy){
        this.watchedBy = newWatchedBy;
    }
    return this.save();
};


/**
 * create
 * @memberof ResourceItem
 * @static
 * @param title
 * @param url
 * @param tags
 * @returns {*|Promise}
 */
ResourceItem.statics.create = function (title, url, tags ) {
    let resourceItem = new this({
        url: url,
        title: title,
        tags: tags
    });
    return resourceItem.save()
};


/**
 * getUnwatchedVideos
 * @memberof ResourceItem
 * @static
 * @param options
 * @param options.userId
 * @param options.skip how many videos skip from start?(default = 0);(in pages,
 *      in order to get amount of videos to skip multiplication by config.appearence.videosPerPage is needed;
 * @returns {Promise}
 */
ResourceItem.statics.getUnwatchedVideos = function (options) {
    let filterObj = {};
    if(options.userId){
        filterObj.watchedBy = mongoose.Types.ObjectId(options.userId);
    }
    return this.find(filterObj)
        .skip((options.skip || 0)*config.appearence.videosPerPage)
        .limit(config.appearence.videosPerPage)
        .select({"url": 1, "tags": 1, "title": 1})
        .lean()
        .exec();
};

/**
 * getAllVideos
 * @memberof ResourceItem
 * @static
 * @param options
 * @param options.skip how many videos skip from start?(default = 0);(in pages,
 *      in order to get amount of videos to skip multiplication by config.appearence.videosPerPage is needed;
 * @returns {Promise}
 */
ResourceItem.statics.getAllVideos = function (options) {
    return this.find({})
        .skip((options.skip || 0)*config.appearence.videosPerPage)
        .limit(config.appearence.videosPerPage)
        .select({"url": 1, "tags":1, "title": 1})
        .lean()
        .exec();
};

/**
 * getVideosByTags
 * @memberof ResourceItem
 * @static
 * @param options
 * @param options.tags - array of strings
 * @returns {Promise}
 */
ResourceItem.statics.getVideosByTags = function (options) {
    return this.find({ tags: { $all: options.tags }})
        .skip((options.skip || 0)*config.appearence.videosPerPage)
        .limit(config.appearence.videosPerPage)
        .lean()
        .select({"url": 1, "tags":1, "title": 1})
        .exec();
};


/**
 * getAllTags
 * @memberof ResourceItem
 * @static
 * @param options
 * @return {Promise}
 */
ResourceItem.statics.getAllTags = function (options) {
    return this.aggregate([
        {
            $unwind: "$tags"
        },
        {
            $sortByCount: "$tags"
        },
        {
            $project:{
                tag: "$_id",
                counter: "$count",
                _id: 0
            }
        },
        {
            $limit: options.limit || config.appearence.leftSideBarTagsAmount
        }
    ]).exec();
}

module.exports = ResourceItem;


const YouAPI = require("youtube-thumbnail");

class LibraryFunctions {
    static getYoutubeThumbnail(url){
        return YouAPI(url).medium;
    }
}


module.exports = LibraryFunctions;

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}
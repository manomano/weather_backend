let nodeCache = require('node-cache');
let cache = null;

module.exports.start = function(done) {
    if (cache) return done();

    cache = new nodeCache();
}

module.exports.instance = function() {
    return cache;
}

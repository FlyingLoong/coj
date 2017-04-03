let redis = require('redis');
let redisClient = redis.createClient();

function set(key, value, callback) {
    redisClient.set(key, value, function(err, res) {
        if (err) {
            console.log(err);
            return;
        }
        callback(res);
    })
}

function get(key, callback) {
    redisClient.get(key, function(err, res) {
        if (err) {
            console.log(err);
            return;
        }
        callback(res);
    })
}

function expire(key, timeInSeconds) {
    redisClient.expire(key, timeInSeconds);
}

function quit() {
    redisClient.quit();
}

module.exports = {
    get: get,
    set: set,
    expire: expire,
    quit: quit,
    redisPrint: redis.print
}
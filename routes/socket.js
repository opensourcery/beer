/**
 * Our main application.
 */
var UntappdClient = require('node-untappd/UntappdClient');

/**
 * Configuration
 */
var untappdConfig = require ('../config/secret');
var beerIds = require ('../config/beers');

/**
 * Init Untappd.
 */
var untappd = new UntappdClient(untappdConfig.debug);

untappd.setClientId(untappdConfig.clientId);
untappd.setClientSecret(untappdConfig.clientSecret);

/**
 * Redis cache.
 */
var redis = require('redis');
var cache = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);

// Check for cached data.
var key = 'os-beer-info';

var beerCache = (function() {

  var get = function (cache, untappd, beerId, tapNumber, socket) {
    var cacheKey = key + '-' + beerId;
    // Cache individual beers for a month.
    var cacheTime = 3600 * 24 * 30;
    cache.get(cacheKey, function (err, result) {
      if (err || !result) {
        // Call untappd.
        untappd.beerInfo(function(err,data) {
          socket.emit('send:beers', {
            beer: data.response.beer
          })
          cache.setex(cacheKey, 3600, JSON.stringify(data.response.beer));
        }, beerId);
      }
      else {
        socket.emit('send:beers', {
          beer: JSON.parse(result)
        });
      }
    });
  }

  return {
    get: get
  }
}());


/*
 * Serve content over a socket
 */
module.exports = function (socket) {
  // Send each beer.
  for (var tapNumber in beerIds.ids) {
    var beer = beerCache.get(cache, untappd, beerIds.ids[tapNumber], tapNumber, socket);
  }

  setInterval(function () {
    socket.emit('send:time', {
      time: (new Date()).toString()
    });
  }, 1000);
};

/**
 * Our main application.
 */
var UntappdClient = require('node-untappd/UntappdClient');

var util= require('util');

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
        util.debug('Calling untappd API');
        untappd.beerInfo(function(err,data) {
          socket.emit('send:beers', {
            beer: slimData(data.response.beer),
            tapNumber: tapNumber
          })
          cache.setex(cacheKey, 3600, JSON.stringify(data.response.beer));
        }, beerId);
      }
      else {
        util.debug('Found beer in cache');
        socket.emit('send:beers', {
          beer: slimData(JSON.parse(result)),
          tapNumber: tapNumber
        });
      }
    });
  }

  /**
   * Trim out unneeded untappd data to make front end faster.
   */
  var slimData = function (data) {
    delete data.checkins;
    delete data.friends;
    delete data.media;
    delete data.similar;
    delete data.stats;
    return data;
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

  // Emit last cached kegerator data. Will update when kegbot posts new data.
  cache.get('kegerator.environment', function (err, result) {
    if (err || !result) {
      // Hardcode static values in event of no cached data.
      var kegerator = {
        temperature: 34,
        kegs: [0.99, 0.77]
      };
    }
    else {
      var kegerator = JSON.parse(result);
    }
    socket.emit('send:environment', kegerator);
  });
};

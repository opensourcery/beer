/**
 * A POST API to update keg levels and environment variables.
 */

/**
 * Redis cache.
 */
var redis = require('redis');
var cache = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);

exports.environment = function (req, res) {
  var kegerator = {
    temperature: req.body.temperature,
    kegs: JSON.parse(req.body.kegs)
  }
  // @todo Figure out how to do this without globals.
  io.sockets.emit('send:environment', kegerator);
  res.json({response: 'OK'});

  // Update cache.
  cache.setex('kegerator.environment', 3600 * 24 * 7, JSON.stringify(kegerator));
}

exports.landingPage = function (req, res) {
  res.json({response: 'API is active'});
}

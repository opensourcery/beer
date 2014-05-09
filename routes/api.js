/**
 * A POST API to update keg levels and environment variables.
 */

/**
 * Redis cache.
 */
var redis = require('redis');
var cache = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);

exports.environment = function (req, res) {

  // Load stored environment.
  cache.get('kegerator.environment', function (err, result) {
    var kegerator = {};
    if (err || !result) {
      // This should not happen, but just in case, assume full kegs.
      kegerator.kegs = [1, 1];
    }
    else {
      kegerator = JSON.parse(result);
    }

    // Reset.
    if (typeof req.body.reset != 'undefined') {
      var resets = JSON.parse(req.body.reset);
      for (tapNumber in resets) {
        if (resets[tapNumber]) {
          kegerator.kegs[tapNumber] = 1;
          req.app.locals.io.log.info('Reset keg ' + (parseInt(tapNumber) + parseInt(1)) + ' to full');
        }
      }
    }

    // Updates contain deltas rather than actual keg percentages.
    var deltas = JSON.parse(req.body.kegs);
    for (var tapNumber in kegerator.kegs) {
      kegerator.kegs[tapNumber] = Math.max(kegerator.kegs[tapNumber] - deltas[tapNumber], 0);
    }

    kegerator.temperature = req.body.temperature;

    // Update the kegerator environment.
    req.app.locals.io.sockets.emit('send:environment', kegerator);
    res.json({response: 'OK'});
    req.app.locals.io.log.info('Updating environment from API request by user "' + req.user.username + '".');

    // Update cache.
    cache.set('kegerator.environment', JSON.stringify(kegerator));
  });
}

exports.landingPage = function (req, res) {
  res.json({response: 'API is active'});
}

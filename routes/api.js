/**
 * A POST API to update keg levels and environment variables.
 */

exports.environment = function (req, res) {
  var kegerator = {
    temperature: req.body.temperature,
    kegs: JSON.parse(req.body.kegs)
  }
  // @todo Figure out how to do this without globals.
  io.sockets.emit('send:environment', kegerator);
  res.json({response: 'OK'});
}

exports.landingPage = function (req, res) {
  res.json({response: 'API is active'});
}

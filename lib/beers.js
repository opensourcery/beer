/**
 * Given beer IDs, manage beer info via either cache or untappd.
 */

// Check for cached data.
var key = 'os-beer-info';

var untappdBeers = (function () {
  // Initialize our beers. This only happens on app start.
  var get = function (cache, untappd, beers) {
    beers.details = [];
    for (var i in beers.ids) {
      untappd.beerInfo(function(err,data) {
        beers.details.push(data.response.beer);
        cache.setex(key, 3600, beers.details);
      }, beers.ids[i]);
    }
  }

  return {
    get: get
  }
}());

module.exports = function (cache, untappd, beers) {
  cache.get(key, function (err, result) {
    if (true, err || !result) {
      // Call untappd.
      untappdBeers.get(cache, untappd, beers);
    }
    else {
      beers.details = result;
    }
  });
}

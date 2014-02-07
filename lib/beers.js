/**
 * Given beer IDs, manage beer info via either cache or untappd.
 */
module.exports = function (cache, untappd, beers) {
  // Check for cached data.
  var key = 'os-beer-info';
  cache.get(key, function (err, result) {
    if (err || !result) {
      // Call untappd.
      beers.details = 'todo';
      cache.setex(key, 3600, beers.details);
    }
    else {
      beers.details = result;
    }
  });
}

/*
 * Serve content over a socket
 */

module.exports = function (socket, beers) {
  // Initialize our beers. This only happens on app start.
  var beers = [];
  for(var i in beerIds.beers) {
    untappd.beerInfo(function(err,data) {
      beers[i] = data.response.beer;
console.log(data)
    }, beerIds.beers[i]);
  }

  setInterval(function () {
    socket.emit('send:beers', {
      beers: beers
    });
  }, 1000);

  setInterval(function () {
    socket.emit('send:time', {
      time: (new Date()).toString()
    });
  }, 1000);
};

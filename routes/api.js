/*
 * Serve JSON to our AngularJS client
 */

exports.kegerator = function (req, res) {
  res.json({
  	// Todo this should come from the kegerator.
    kegerator: {
      temperature: 34,
      kegs: [
        {
          percentRemaining: 42
        },
        {
          percentRemaining: 77
        }
      ]
    }
  });
};

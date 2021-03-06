'use strict';

/* Controllers */
angular.module('osBeer.controllers', []).
  controller('Kegerator', ['$scope', 'socket',

    function($scope, socket) {
      // Initialize with loading incomplete.
      var loadingComplete = false;

      $scope.beers = (typeof $scope.beers === 'undefined') ? [] : $scope.beers;
      socket.on('send:beers', function (data) {
        var tapNumber = data.tapNumber;
        $scope.beers[tapNumber] = mergeBeer($scope.beers[tapNumber], data.beer);

        // Ensure loading screen is hidden and beers are displayed.
        loadingComplete = true;
      });

      // Keg environment.
      socket.on('send:environment', function (data) {
        $scope.temperature = data.temperature;
        for (var tapNumber in data.kegs) {
          // Convert to actual percentage.
          var percent = data.kegs[tapNumber] * 100;

          // Init beers if undefined.
          $scope.beers[tapNumber] = mergeBeer($scope.beers[tapNumber], { percentRemaining: percent.toPrecision(3) });
        }

        // Ensure loading screen is hidden and beers are displayed.
        loadingComplete = true;
     });

     $scope.loadingComplete = function () {
       return loadingComplete;
     }
    }
  ]);

var mergeBeer = function(beer1, beer2) {
  var beer = {};
  if (typeof beer1 === 'undefined') {
     beer1 = {};
  }
  if (typeof beer2 === 'undefined') {
     beer2 = {};
  }
  for (var attrname in beer1) { beer[attrname] = beer1[attrname]; }
  for (var attrname in beer2) { beer[attrname] = beer2[attrname]; }
  return beer;
}

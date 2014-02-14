'use strict';

/* Controllers */

angular.module('osBeer.controllers', []).
  controller('Kegerator', ['$scope', 'socket',
    function($scope, socket) {
      $scope.beers = [];
      socket.on('send:beers', function (data) {
        $scope.beers.push(data.beer);
      });
      socket.on('send:time', function (data) {
        $scope.time = data.time;
      });
    }
  ]);

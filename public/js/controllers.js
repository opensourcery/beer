'use strict';

/* Controllers */

angular.module('osBeer.controllers', []).
  controller('Kegerator', ['$scope', 'socket',
    function($scope, socket) {
      socket.on('send:beers', function (data) {
        $scope.kegerator = data.kegerator;
        $scope.beers = data.beers;
console.log(data);
      });
      socket.on('send:time', function (data) {
        $scope.time = data.time;
      });
    }
  ]);

'use strict';

/* Controllers */

angular.module('osBeer.controllers', []).
  controller('Kegs', ['$scope', 'Kegs',
    function($scope, Kegs) {
      $scope.kegs = Kegs.query();
    }
  ]).
  controller('Kegerator', ['$scope', 'Kegerator',
    function($scope, Kegerator) {
      $scope.environment = Kegerator.query();
    }
  ]);

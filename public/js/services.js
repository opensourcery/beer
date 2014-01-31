'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('osBeer.services', ['ngResource']).
  factory('Kegerator', ['$resource',
    function($resource){
      return $resource('kegerator.json', {}, {
        query: {method: 'GET'}
      });
    }
  ]);

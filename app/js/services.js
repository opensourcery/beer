'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('osBeer.services', ['ngResource']).
  factory('Kegs', ['$resource',
    function($resource){
      return $resource('kegs/:kegId.json', {}, {
        query: {method: 'GET', params:{kegId:'kegs'}, isArray:true}
      });
    }
  ]).
  factory('Kegerator', ['$resource',
    function($resource){
      return $resource('kegerator.json', {}, {
        query: {method: 'GET'}
      });
    }
  ]);

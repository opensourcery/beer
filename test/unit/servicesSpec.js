'use strict';

/* jasmine specs for services go here */

describe('service', function() {
  beforeEach(module('osBeer.services'));


  describe('Kegs', function() {
    it('should return 2 kegs', inject(function(Kegs) {
      expect(Kegs.query().length).toEqual(2);
    }));
  });
});

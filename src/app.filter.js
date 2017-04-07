(function(){
  'use strict';

  angular.module('app')
  .filter('isNull', function(){
    return function(input){
      return input || '/';
    }
  });
})();
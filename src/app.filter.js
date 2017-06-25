(function(){
  'use strict';

  angular.module('app')
  .filter('isNull', function(){
    return function(input){
      return input || '/';
    }
  })
  .filter('trustAsHtml', ['$sce', function($sce){
    return function(input){
      return $sce.trustAsHtml(input);
    }
  }])
  ;
})();
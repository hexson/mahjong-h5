(function(){
  'use strict';
  
  angular.module('app')
  .controller('discoveCtrl', ['$scope', '$state', '$interval', '$timeout', function(vm, $state, $interval, $timeout){
    vm.openRoom = function(){
      $state.go('main.index');
    }
  }]);
})();
(function(){
  'use strict';
  
  angular.module('app')
  .controller('recordCtrl', ['$scope', '$state', '$interval', '$timeout', function(vm, $state, $interval, $timeout){
    vm.tabActive = 0;
    vm.tab = function(active){
      vm.tabActive = active;
    }
  }]);
})();
(function(){
  'use strict';
  
  angular.module('app')
  .controller('loadingCtrl', ['$scope', '$state', '$interval', '$timeout', function(vm, $state, $interval, $timeout){
    vm.loadings = 0;
    var counter = 1;
    vm.timer = $interval(function(){
      if (counter == 100){
        $interval.cancel(vm.timer);
        $state.go('main.index');
      }
      vm.loadings = counter;
      counter++;
    }, 20);
  }]);
})();
(function(){
  'use strict';
  
  angular.module('app')
  .controller('loadingCtrl', ['$scope', '$state', '$interval', '$timeout', '$rootScope', 'utils', function(vm, $state, $interval, $timeout, $rootScope, u){
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
    $rootScope.footerHide = !0;
  }]);
})();
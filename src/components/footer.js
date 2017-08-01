(function(){
  'use strict';

  angular.module('app')
  .controller('footer', ['$scope', '$rootScope', '$state', function(vm, $rootScope, $state){
    var height = vm.indexWidth / 720;
    vm.indexFooterStyle = 'height:' + (height * 144) + 'px';
  }]);
})();
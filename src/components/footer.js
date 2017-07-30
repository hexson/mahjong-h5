(function(){
  'use strict';

  angular.module('app')
  .controller('footer', ['$scope', function(vm){
    var height = vm.indexWidth / 720;
    vm.indexFooterStyle = 'height:' + (height * 144) + 'px';
  }]);
})();
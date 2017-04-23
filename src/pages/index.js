(function(){
  'use strict';
  
  angular.module('app')
  .controller('indexCtrl', ['$scope', '$state', '$interval', '$timeout', function(vm, $state, $interval, $timeout){
    var height = vm.indexWidth / 720;
    vm.indexHeaderStyle = 'height:' + (height * 160) + 'px';
    vm.indexFooterStyle = 'height:' + (height * 144) + 'px';
    vm.indexCotStyle = 'padding:' + (height * 160) + 'px';
    vm.indexCotStyle += ' 0 ' + (height * 144) + 'px' + ' 0';
    vm.sxmj = function(){
      window.location = '/sxmj';
    }
  }]);
})();
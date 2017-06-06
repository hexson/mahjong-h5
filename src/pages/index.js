(function(){
  'use strict';
  
  angular.module('app')
  .controller('indexCtrl', ['$scope', '$state', '$interval', '$timeout', '$rootScope', 'utils', function(vm, $state, $interval, $timeout, root, u){
    var height = vm.indexWidth / 720;
    vm.indexHeaderStyle = 'height:' + (height * 160) + 'px';
    vm.indexFooterStyle = 'height:' + (height * 144) + 'px';
    vm.indexCotStyle = 'padding:' + (height * 160) + 'px';
    vm.indexCotStyle += ' 0 ' + (height * 144) + 'px' + ' 0';
    vm.create = function(game){
      if (game.state != 'enable'){
        return u.toastr('游戏即将上线');
      }
      $state.go('main.create', {code: game.code});
    }
    vm.room = function(){
      $state.go('main.into');
    }
    var bg = document.getElementById('bg');
    vm.play = function(){
      if (bg.paused){
        bg.play();
      }else {
        bg.pause();
      }
      vm.paused = bg.paused;
    }
    vm.play();
    vm.get = function(){
      u.post('gateway/games')
      .then(function(res){
        root.list = vm.list = res.data;
      });
    }
    if (!vm.list) vm.get();
    if (root.info && root.info.share) root.share = true;
  }]);
})();
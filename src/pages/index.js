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
    var bgm = document.getElementById('bgm');
    var timer;
    vm.paused = bgm.paused;
    vm.play = function(){
      if (bgm.paused){
        bgm.play();
      }else {
        bgm.pause();
      }
      vm.paused = bgm.paused;
    }
    // if (root.played){
    //   bgm.load();
    //   timer = setInterval(function(){
    //     if (bgm.paused){
    //       bgm.play();
    //       vm.paused = bgm.paused;
    //       vm.count += 1;
    //     }else {
    //       clearInterval(timer);
    //       root.played = false;
    //     }
    //   }, 100);
    // }
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
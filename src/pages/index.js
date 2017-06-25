(function(){
  'use strict';
  
  angular.module('app')
  .controller('indexCtrl', ['$scope', '$state', '$interval', '$timeout', '$rootScope', 'utils', function(vm, $state, $interval, $timeout, root, u){
    var height = vm.indexWidth / 720;
    vm.indexHeaderStyle = 'height:' + (height * 160) + 'px';
    vm.indexFooterStyle = 'height:' + (height * 144) + 'px';
    vm.indexCotStyle = 'padding:' + (height * 160) + 'px';
    vm.indexCotStyle += ' 0 ' + (height * 144) + 'px' + ' 0';
    vm.ads = false;
    vm.create = function(game){
      if (game.state != 'enable'){
        return u.toastr('游戏即将上线');
      }
      $state.go('main.create', {code: game.code});
    }
    vm.room = function(){
      $state.go('main.into');
    }
    vm.adsFn = function(){
      vm.ads = !vm.ads;
      if (vm.ads && !vm.swiper){
        $timeout(function(){
          vm.swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            paginationClickable: true,
            resistanceRatio: 0
          });
        }, 0);
      }
    }
    var bgm = document.getElementById('bgm');
    var timer;
    var audio = new Audio();
    audio.src = 'http://'+location.host+'/mp3/background_music.mp3';
    audio.onloadedmetadata = function(){
      bgm.play();
      vm.paused = bgm.paused;
    };
    vm.play = function(){
      if (bgm.paused){
        bgm.play();
      }else {
        bgm.pause();
      }
      vm.paused = bgm.paused;
    }
    vm.get = function(){
      u.post('gateway/games')
      .then(function(res){
        root.list = vm.list = res.data;
      });
    }
    u.post('account/adimg', {code: '001'})
    .then(function(res){
      vm.adimg = res.data;
    });
    if (!vm.list) vm.get();
    vm.hclose = function(){
      vm.share = false;
      u.sstorage('close', 1);
    }
    if (!root.info){
      vm.userinfo(function(){
        if (root.info && root.info.share == 1 && u.sstorage('close') != 1) vm.share = true;
      })
    }
    if (root.info && root.info.share == 1 && u.sstorage('close') != 1) vm.share = true;
    if (u.sstorage('close')) vm.share = false;
  }]);
})();
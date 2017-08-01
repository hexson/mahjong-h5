(function(){
  'use strict';
  
  angular.module('app')
  .controller('indexCtrl', ['$scope', '$state', '$interval', '$timeout', '$rootScope', 'utils', function(vm, $state, $interval, $timeout, $rootScope, u){
    var height = vm.indexWidth / 720;
    vm.indexHeaderStyle = 'height:' + (height * 160) + 'px';
    vm.indexFooterStyle = 'height:' + (height * 144) + 'px';
    vm.indexCotStyle = 'padding:' + (height * 160) + 'px';
    vm.indexCotStyle += ' 0 ' + (height * 144) + 'px' + ' 0';
    vm.ads = false;
    $rootScope.footerHide = false;
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
    // var bgm = document.getElementById('bgm');
    // var timer;
    // var audio = new Audio();
    // audio.src = 'http://'+location.host+'/mp3/background_music.mp3';
    // audio.onloadedmetadata = function(){
    //   bgm.play();
    //   vm.paused = bgm.paused;
    // };
    var file = {
      'mp3': 'http://'+location.host+'/mp3/background_music.mp3',
      'ogg': 'http://'+location.host+'/mp3/background_music.ogg'
    };
    vm.audioplayer('bgm', file, true);
    vm.paused = true;
    vm.play = function(){
      var bgm = document.getElementById('bgm');
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
        $rootScope.list = vm.list = res.data;
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
    vm.hbtn = function(){
      vm.hclose();
      $rootScope.sharecover = true;
    }
    vm.scClose = function(){
      $rootScope.sharecover = false;
    }
    vm.init = function(){
      u.post('gateway/notice')
      .then(function(res){
        vm.notice = res.data;
        clearInterval($rootScope.lefttimer);
        $rootScope.lefttimer = setInterval(function(){
          $rootScope.left = $rootScope.left > (-vm.notice.length * 5) ? ($rootScope.left - 0.3) : 100;
          $('#marquee span').css('margin-left', $rootScope.left+'%');
        }, 16);
      });
    }
    vm.init();
    if (!$rootScope.info){
      vm.userinfo(function(){
        if ($rootScope.info && $rootScope.info.share == 1 && u.sstorage('close') != 1) vm.share = true;
      })
    }
    if ($rootScope.info && $rootScope.info.share == 1 && u.sstorage('close') != 1) vm.share = true;
    if (u.sstorage('close')) vm.share = false;
  }]);
})();
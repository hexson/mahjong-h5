(function(){
  'use strict';
  
  angular.module('app')
  .controller('scoreCtrl', ['$scope', '$state', '$interval', '$timeout', '$rootScope', 'utils', function(vm, $state, $interval, $timeout, root, u){
    vm.active = 1;
    var lan = {
      ROOM_NOT_EXIST: '房间已经失效'
    };
    var parmas = {};
    var str = location.href.substr(location.href.indexOf('?')+1).split('&');
    vm.back = function(){
      vm.active = 1;
    }
    vm.show = function(code){
      u.post('account/playerRoundScore', {
        gameCode: code
      })
      .then(function(res){
        var code = res.code;
        if (code == 'SUCCESS'){
          vm.playerRoundScore = res.data;
          vm.active = 2;
          return;
        }
        u.toastr(lan[code]);
      })
    }
    for (var i = 0; i < str.length; i++){
      var arr = str[i].split('=');
      parmas[arr[0]] = arr[1];
    }
    vm.detail = function(code){
      u.post('account/playerRoundScoreDetail', {
        UCode: code
      })
      .then(function(res){
        var code = res.code;
        if (code == 'SUCCESS'){
          vm.playerDetail = res.data;
          vm.room = res.room;
          if (parmas.UCode){
            vm.detailviews = true;
          }
          return;
        }
        u.toastr(lan[code]);
      })
    }
    if (parmas.UCode){
      vm.detail(parmas.UCode);
    }
    vm.showDetail = function(v){
      vm.detailviews = true;
      vm.item = v;
      vm.detail(v.UCode);
    }
    vm.hideDetail = function(){
      vm.detailviews = false;
    }
    vm.create = function(){
      $state.go('main.create', {code: vm.item.gameCode})
    }
    vm.getScore = function(){
      u.post('account/playerScore')
      .then(function(res){
        var code = res.code;
        if (code == 'SUCCESS'){
          vm.playerScore = res.data;
          return;
        }
        u.toastr(lan[code]);
      })
    }
    vm.get = function(){
      u.post('account/playercount')
      .then(function(res){
        var code = res.code;
        if (code == 'SUCCESS'){
          vm.playercount = res.data;
          return;
        }
        u.toastr(lan[code]);
      })
    }
    vm.get();
    vm.getScore();
  }]);
})();
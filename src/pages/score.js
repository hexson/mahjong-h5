(function(){
  'use strict';
  
  angular.module('app')
  .controller('scoreCtrl', ['$scope', '$state', '$interval', '$timeout', '$rootScope', 'utils', function(vm, $state, $interval, $timeout, root, u){
    vm.active = 1;
    var lan = {
      ROOM_NOT_EXIST: '房间已经失效'
    };
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
    vm.detail = function(code){
      u.post('account/playerRoundScoreDetail', {
        UCode: 'hhhhh'
      })
      .then(function(res){
        var code = res.code;
        if (code == 'SUCCESS'){
          vm.playerDetail = res.data;
          u.each(res.data, function(v){
            if (v.owner == 1) vm.owner = v;
          })
          return;
        }
        u.toastr(lan[code]);
      })
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
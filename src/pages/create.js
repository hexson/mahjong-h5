(function(){
  'use strict';
  
  angular.module('app')
  .controller('createCtrl', ['$scope', '$state', '$interval', '$timeout', '$rootScope', 'utils', function(vm, $state, $interval, $timeout, rootScope, u){
    // vm.time = 1800;
    var lan = {
      USER_ROOM_CREATE_MORE: '同时只可以创建3个以内的房间'
    };
    vm.changeTime = function(time){
      vm.time = time;
    }
    vm.create = function(){
      u.post('gateway/createroom', {
        gameCode: $state.params.code,
        time: vm.time
      })
      .then(function(res){
        var code = res.code;
        if (code == 'SUCCESS'){
          var room = res.data.room;
          location = 'http://game.nbyphy.com/' + room.game + '?room=' + room.room + '&token=' + $.cookie('token');
          return;
        }
        u.toastr(lan[code]);
      })
    }
    vm.get = function(){
      u.post('gateway/RoomTimeConfig')
      .then(function(res){
        vm.timeList = res.data.roomTimeConfig;
        vm.time = res.data.defaultRoomTime;
      })
    }
    vm.get();
  }]);
})();
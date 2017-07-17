(function(){
  'use strict';
  
  angular.module('app')
  .controller('intoCtrl', ['$scope', '$state', '$interval', '$timeout', '$rootScope', 'utils', function(vm, $state, $interval, $timeout, root, u){
    vm.room = '';
    var lan = {
      ROOM_NOT_EXIST: '房间已经失效'
    };
    vm.number = function(n){
      if (vm.room.length < 6) vm.room += n;
      if (vm.room.length == 6){
        u.post('gateway/gointoroom', {
          room: vm.room
        })
        .then(function(res){
          var code = res.code;
          if (code == 'SUCCESS'){
            var room = res.data;
            location = 'http://game.nbyphy.com/' + room.game + '?room=' + room.room + '&token=' + $.cookie('token');
            return;
          }
          u.toastr(lan[code]);
        })
      }
    }
    vm.delete = function(){
      vm.room = vm.room.substring(0, vm.room.length - 1);
    }
    vm.clear = function(){
      vm.room = '';
    }
  }]);
})();
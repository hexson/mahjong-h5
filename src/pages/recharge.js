(function(){
  'use strict';
  
  angular.module('app')
  .controller('rechargeCtrl', ['$scope', '$state', '$interval', '$timeout', '$rootScope', 'utils', function(vm, $state, $interval, $timeout, root, u){
    var lan = {
      ROOM_NOT_EXIST: '房间已经失效'
    };
    vm.img = ['peng_19', 'peng_20', 'peng_23', 'peng_24', 'peng_27', 'peng_28'];
    vm.showShare = function(){
      u.toastr('充值功能即将上线')
    }
    vm.hideShare = function(){
      vm.share = false;
    }
    vm.get = function(){
      u.post('gateway/denomination')
      .then(function(res){
        var code = res.code;
        if (code == 'SUCCESS'){
          vm.denomination = res.data;
          return;
        }
        u.toastr(lan[code]);
      })
    }
    vm.get();
  }]);
})();
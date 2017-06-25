(function(){
  'use strict';
  
  angular.module('app')
  .controller('feedbackCtrl', ['$scope', '$state', '$interval', '$timeout', '$rootScope', 'utils', function(vm, $state, $interval, $timeout, root, u){
    var lan = {
      ROOM_NOT_EXIST: '房间已经失效'
    };
    vm.get = function(){
      u.post('account/notice', {tag: 'notice'})
      .then(function(res){
        var code = res.code;
        if (code == 'SUCCESS'){
          vm.notice = res.data.content;
          return;
        }
        u.toastr(lan[code]);
      })
    }
    vm.get();
  }]);
})();
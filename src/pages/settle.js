(function(){
  'use strict';
  
  angular.module('app')
  .controller('settleCtrl', ['$scope', '$state', '$interval', '$timeout', '$rootScope', 'utils', function(vm, $state, $interval, $timeout, root, u){
    var lan = {
      // AMOUNT_ERR: '金币提取需大于200以上'
      AMOUNT_ERR: '金币提取失败'
    };
    vm.settle = function(){
      if (!/^[1-9][0-9]{0,}$/.test(vm.amount)){
        return u.toastr('请输入正确的金币数量');
      }
      u.post('account/settle', {
        amount: vm.amount
      })
      .then(function(res){
        var code = res.code;
        if (code == 'SUCCESS'){
          vm.result = true;
          return;
        }
        u.toastr(lan[code]);
      })
    }
    vm.hide = function(){
      vm.result = false;
    }
  }]);
})();